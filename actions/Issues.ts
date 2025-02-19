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
interface User {
    name: string | null;
    id: string;
    clerkUserId: string;
    email: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
interface Issue {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    priority: string;
    order: number;
    sprintId: string | null;  // Updated to match Prisma schema
    projectId: string;
    assignee: User | null;
    reporter: User;
    createdAt: Date;
    updatedAt: Date;
  }
export async function getIssues(sprintId: string): Promise<Issue[]> {
    const session = await auth();
    const userId = session?.userId;
    const orgId = session?.orgId;
    
    if(!userId || !orgId) {
        throw new Error("You must be signed in to get projects");
    }

    try {
        const issues = await db.issue.findMany({
            where: {
                sprintId: sprintId
            },
            include: {
                assignee: true,
                reporter: true,
            },
            orderBy: [
                {
                    order: "asc",
                },
                {
                    status: "asc",
                },
            ],
        });

        // Type assertion to ensure the returned data matches the Issue interface
        return issues as Issue[];
    } catch (error) {
        throw new Error("Failed to get issues");
    }
}


export async function updateIssueStatus(updateIssues : any) {
    const session = await auth();
    const userId = session?.userId;
    const orgId = session?.orgId;
    if(!userId || !orgId){
        throw new Error("You must be signed in to get projects");
    }
    await db.$transaction(async (prismats : any) =>{
        for( const issue of updateIssues) {
            await prismats.issue.update({
                where: {
                    id: issue.id
                },
                data: {
                    status: issue.status,
                    order: issue.order
                }
            })
        }
    })
    return {success : true}
}