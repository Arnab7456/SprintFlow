"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { SprintStatus } from "@/lib/types/sprint.d";

interface SprintData {
  name: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
}

const createSprintData = async (projectId: string, sprintData: SprintData) => {
  const session = await auth();
  const userId = session?.userId;
  const orgId = session?.orgId;

  if (!userId || !orgId) {
    throw new Error("You must be signed in to create a sprint");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      organizationId: orgId,
    },
  });

  if (project?.organizationId !== orgId) {
    return null;
  }

  try {
    const sprint = await db.sprint.create({
      data: {
        name: sprintData.name,
        startDate: sprintData.startDate,
        endDate: sprintData.endDate,
        status: "PLANNED",
        projectId: projectId,
      },
    });
    return sprint;
  } catch (error) {
    return null;
  }
};

export default createSprintData;


export async function updateSprintStatus(sprintId: string, newStatus: SprintStatus) {
    const session = await auth();
    const userId = session?.userId;
    const orgId = session?.orgId;
    const orgRole = session?.orgRole;  
      
        if (!userId || !orgId) {
          throw new Error("Unauthorized");
        }
      
        try {
          const sprint = await db.sprint.findUnique({
            where: { id: sprintId },
            include: { project: true },
          });
      
          if (!sprint) {
            throw new Error("Sprint not found");
          }
      
          if (sprint.project.organizationId !== orgId) {
            throw new Error("Unauthorized");
          }
      
          if (orgRole !== "org:admin") {
            throw new Error("Only Admin can make this change");
          }
      
          const now = new Date();
          const startDate = new Date(sprint.startDate);
          const endDate = new Date(sprint.endDate);
      
          if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
            throw new Error("Cannot start sprint outside of its date range");
          }
      
          if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
            throw new Error("Can only complete an active sprint");
          }
      
          const updatedSprint = await db.sprint.update({
            where: { id: sprintId },
            data: { status: newStatus },
          });
      
          return { success: true, sprint: updatedSprint };
        } catch (error) {
          throw new Error("Failed to update sprint: " + error);
        }
      }