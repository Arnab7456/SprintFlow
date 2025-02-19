export interface ProjectData {
    title: string;  
    description: string,
    status: IssueStatus,
    priority: IssuePriority,
    projectId: string,
    sprintId: string,
    reporterId: string,
    assigneeId: string | null, 
    order: number

  }
  
  export type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  export interface Issue {
   isOpen: boolean
   onClose: () => void
   sprintId: string
   status : any
   onIssueCreated: () => void
   orgID: string 
  }

  // lib/types/issue.d.ts
export type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  order: number;
  assignee?: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  } | null;
  reporter: {
    id: string;
    name: string | null;
    email: string;
    imageUrl: string | null;
  };
  sprintId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}