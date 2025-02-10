'use server'

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

    const { data: memberships } = await clerk.organizations.getOrganizationMembershipList({
      organizationId: organization.id
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