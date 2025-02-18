export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export interface IssueFormData {
  title: string;
  description: string;
  assigneeId: string;
  priority: IssuePriority;
}

export interface IssueCreationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    sprintId: string;
    status: IssueStatus;
    projectId: string;
    onIssueCreated: () => void;
    orgId: string;
  }

  export export interface DBUser {
    id: string;
    name: string | null;
    clerkUserId: string;
    email: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  