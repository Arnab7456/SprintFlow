'use server'

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

interface SprintData {
    name: string
    startDate: Date
    endDate: Date
}
 const createSprintData = async (projectId: string, sprintData: SprintData) => {
    const session = await auth();
    const userId = session?.userId;
    const orgId = session?.orgId;
    if(!userId || !orgId){
        throw new Error("You must be signed in to create a sprint");
    }
    const project = await db.project.findUnique({
        where: {
            id: projectId,
            organizationId: orgId
        }
    })
    if(project?.organizationId !== orgId){
        return null;
    }
    try {
        const sprint = await db.sprint.create({
            data: {
                name: sprintData.name,
                startDate: sprintData.startDate,
                endDate: sprintData.endDate,
                status: "PLANNED",
                projectId: projectId
            }
        })
        return sprint;
    } catch (error) {
        return null;
    }
}

export default createSprintData;