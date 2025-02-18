"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ProjectData } from "@/lib/types/issue.d";

export default async function CreateIssue(projectId:string,data: ProjectData) {
    const session = await auth();
    const userId = session?.userId;
    const orgId = session?.orgId;
    if(!userId || !orgId){
        throw new Error("You must be signed in to create a project");
    }
    let user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    if(!user){
        throw new Error("You must be signed in to create a project");
    }

    const lastIssue = await db.issue.findFirst({
        where: {
            projectId: projectId,
            status : data.status
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    const newOrder = lastIssue? lastIssue.order + 1 : 0;
    const issue = await db.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            projectId: projectId,
            sprintId: data.sprintId,
            reporterId: user.id,
            assigneeId: data.assigneeId || null, 
            order: newOrder
        },
        include: {
            assignee: true,
            reporter: true,
        }
    })
    return issue;
}
   