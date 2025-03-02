"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-Avatar";
import useFetch from "@/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import statuses from "@/data/statusPro.json";
import { deleteIssue, updateIssue } from "@/actions/Issues";

// Type definitions
type User = {
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

type DeleteResponse = {
  success: boolean;
  id?: string;
};

interface IssueDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
  onDelete?: () => void;
  onUpdate?: (updatedIssue: Issue) => void;
  borderCol?: string;
}

const priorityOptions: string[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
  borderCol = "",
}: IssueDetailsDialogProps) {
  const [status, setStatus] = useState<string>(issue.status);
  const [priority, setPriority] = useState<string>(issue.priority);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  // Update local state when issue prop changes
  useEffect(() => {
    setStatus(issue.status);
    setPriority(issue.priority);
  }, [issue.status, issue.priority]);

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch<DeleteResponse>(deleteIssue);

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const handleDelete = async (): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };

  const handleStatusChange = async (newStatus: string): Promise<void> => {
    if (newStatus === status || isUpdating) return;
    
    setStatus(newStatus);
    setIsUpdating(true);
    await updateIssueFn(issue.id, { status: newStatus, priority });
  };

  const handlePriorityChange = async (newPriority: string): Promise<void> => {
    if (newPriority === priority || isUpdating) return;
    
    setPriority(newPriority);
    setIsUpdating(true);
    await updateIssueFn(issue.id, { status, priority: newPriority });
  };

  useEffect(() => {
    if (deleted && deleted.success) {
      onClose();
      onDelete();
    }
    if (updated && updated.success && updated.issue) {
      onUpdate(updated.issue as Issue);
      setIsUpdating(false);
    }
  }, [deleted, updated, onClose, onDelete, onUpdate]);

  const canChange: boolean =
    user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  const handleGoToProject = (): void => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage: boolean = !pathname.startsWith("/project/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {(updateLoading || deleteLoading) && (
          <BarLoader width={"100%"} color="#36d7b7" />
        )}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
              <SelectTrigger className="">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={priority}
              onValueChange={handlePriorityChange}
              disabled={!canChange || isUpdating}
            >
              <SelectTrigger className={`border ${borderCol} rounded`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded px-2 py-1"
              source={issue.description ? issue.description : "--"}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              {issue.assignee && (
                <UserAvatar user={issue.assignee} />
              )}
              {!issue.assignee && (
                <p className="text-sm text-gray-500">No assignee</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporter} />
            </div>
          </div>
          {canChange && (
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? "Deleting..." : "Delete Issue"}
            </Button>
          )}
          {(deleteError || updateError) && (
            <p className="text-red-500">
              {deleteError?.message || updateError?.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}