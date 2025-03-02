"use client";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { useState } from "react";
import IssueDetailsCard from "./IssueDetailsCard";
import { useRouter } from "next/navigation";

export type User = {
    id: string;
    clerkUserId: string;
    name?: string | null;
    email?: string;
    imageUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
interface Issue {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
    priority: string;
    order: number;
    sprintId: string | null;  
    projectId: string;
    assignee: User | null;
    reporter: User;
    createdAt: Date;
    updatedAt: Date;
}
export type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

interface IssueCardProps {
  issue: Issue;
  showStatus: boolean;
  onDelete: (issueData?: any) => void;
  onUpdate: (issueData?: any) => void;
}

const IssueCard = ({
  issue,
  showStatus,
  onDelete,
  onUpdate,
}: IssueCardProps) => {
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });
  const borderColor = "border-gray-500/50";
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  
  const onDeleteHandler = (issueData?: any): void => {
    router.refresh();
    onDelete(issueData);
  };

  const onUpdateHandler = (issueData?: any): void => {
    router.refresh();
    onUpdate(issueData);
  };

  return (
    <>
      <Card
        onClick={() => setIsDialogOpen(true)}
        className={`relative hover:shadow-md transition-shadow duration-200 ${borderColor} border-l-4`}
      >
        <CardHeader className="p-4 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
              {issue.title}
            </CardTitle>
            {showStatus && (
              <Badge
                variant={issue.status === "DONE" ? "secondary" : "outline"}
                className="shrink-0 capitalize"
              >
                {issue.status.toLowerCase().replace('_', ' ')}
              </Badge>
            )}
          </div>

          <CardDescription className="text-muted-foreground text-sm line-clamp-3">
            {issue.description}
          </CardDescription>
        </CardHeader>

        {showStatus && (
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="px-2 py-1 text-sm">
                <span className="text-muted-foreground">Priority:</span>
                <span className="ml-1 font-medium capitalize">
                  {issue.priority.toLowerCase()}
                </span>
              </Badge>

              {issue.assignee && (
                <Badge variant="outline" className="px-2 py-1 text-sm">
                  <span className="text-muted-foreground">Assignee:</span>
                  <span className="ml-1 font-medium">
                    {issue.assignee.name}
                  </span>
                </Badge>
              )}
            </div>
          </CardContent>
        )}

        <CardFooter className="p-4 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {issue.assignee && (
              <>
                <span className="text-sm text-muted-foreground">
                  {issue.assignee.name}
                </span>
              </>
            )}
          </div>
          <div className="text-sm text-muted-foreground">Created {created}</div>
        </CardFooter>
      </Card>
      {isDialogOpen && (
        <IssueDetailsCard
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
        />
      )}
    </>
  );
};

export default IssueCard;