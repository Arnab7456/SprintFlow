"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
  try {
    const session = await auth();

    if (!session?.userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: session.userId },
    });

    if (!user) {
      return null;
    }

    const clerk = await clerkClient();
    const organization = await clerk.organizations.getOrganization({ slug });

    if (!organization) {
      return null;
    }

    const { data: memberships } =
      await clerk.organizations.getOrganizationMembershipList({
        organizationId: organization.id,
      });

    const userMembership = memberships.find(
      (member: any) => member.publicUserData.userId === session.userId
    );

    if (!userMembership) {
      return null;
    }

    return organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return null;
  }
}

export default async function getOrganizationusers(orgId: string) {
  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("user not found");
  }

  const clerk = await clerkClient();
  const orgMembership = await clerk.organizations.getOrganizationMembershipList(
    {
      organizationId: orgId,
    }
  );
  const userIds = orgMembership.data.map(
    (member: any) => member.publicUserData.userId
  );
  const users = await db.user.findMany({
    where: { clerkUserId: { in: userIds } },
  });
  return users;
}
