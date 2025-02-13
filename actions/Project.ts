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

export async function getProjects(ProjectId: string) {
  const session = await auth();
  const userId = session?.userId;
  const orgId = session?.orgId;
  console.log("GetProjects - Session:", { userId, orgId });
  
  if (!userId) {
    throw new Error("You must be signed in to get projects");
  }

  if (!orgId) {
    throw new Error("Organization ID is required");
  }

  try {
    // console.log("GetProjects - Querying with:", { organizationId: orgId });

    const projects = await db.project.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
        name: true,
        key: true,
        description: true,
        organizationId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },  
    });
    
    // console.log("GetProjects - Raw result:", projects);
    
    // if (!Array.isArray(projects)) {
    //   console.error("GetProjects - Projects is not an array:", projects);
    //   return [];
    // }

    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
}
