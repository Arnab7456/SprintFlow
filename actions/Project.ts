'use server';
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

interface ProjectData {
  name: string;
  key: string;
  description?: string;
}

export async function createProject(data: ProjectData) {
  const session = await auth();
  const userId = session?.userId;
  const orgId = session?.orgId;
  const orgRole = session?.orgRole;
  
  if (!userId) {
    throw new Error("You must be signed in to create a project");
  }
  
  if (!orgId) {
    throw new Error("You must be a member of an organization to create a project");
  }
  if (orgRole !== "org:admin") {
    throw new Error("You must be an organization admin to create a project");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description || "",
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    console.error("Project creation failed:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
    throw new Error("Failed to create project: Unknown error occurred");
  }
}