"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import SprintManager from "./SprintManger";
import { Sprint } from "@/lib/types/sprint.d";
import CreateIssueDrawer from "./Create-issue-drawer";
import { Loader2, Plus } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { getIssues, updateIssueStatus } from "@/actions/Issues";
import IssueCard from "@/components/IssueCard";
import { toast } from "sonner";
import type { DropResult } from '@hello-pangea/dnd';

// Dynamically import DnD components with ssr disabled
const DragDropContext = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);
const Droppable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Droppable),
  { ssr: false }
);
const Draggable = dynamic(
  () => import('@hello-pangea/dnd').then(mod => mod.Draggable),
  { ssr: false }
);

type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

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
  sprintId: string | null;  
  projectId: string;
  assignee: User | null;
  reporter: User;
  createdAt: Date;
  updatedAt: Date;
}
interface SprintBoardProps {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
}

interface StatusColumn {
  key: IssueStatus;
  name: string;
  bgColor: string;
}

// DnD helper function
const reorder = (list: Issue[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const typedStatusPro: StatusColumn[] = [
  { key: "TODO", name: "To Do", bgColor: "border-r-4 border-blue-400 dark:border-blue-500" },
  { key: "IN_PROGRESS", name: "In Progress", bgColor: "border-r-4 border-yellow-400 dark:border-yellow-500" },
  { key: "IN_REVIEW", name: "In Review", bgColor: "border-r-4 border-purple-400 dark:border-purple-500" },
  { key: "DONE", name: "Done", bgColor: "border-r-4 border-green-400 dark:border-green-500" }
];

export const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
  // Only initialize state once with a default sprint
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>("TODO");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  const {
    fn: fetchIssues,
    loading: issuesLoading,
    data: issues = [] as Issue[],
    setData: setIssues,
    error: issuesError
  } = useFetch<Issue[]>(getIssues);

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueStatus);

  // Handle client-side rendering detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize the current sprint only once
  useEffect(() => {
    if (sprints.length > 0 && !currentSprint) {
      const activeSprint = sprints.find((sprint) => sprint.status === "ACTIVE");
      setCurrentSprint(activeSprint || sprints[0]);
    }
  }, [sprints, currentSprint]);

  // Fetch issues when sprint changes
  useEffect(() => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint?.id]);

  // Update filtered issues when raw issues change
  useEffect(() => {
    if (issues && issues.length > 0) {
      setFilteredIssues(issues);
    }
  }, [issues]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !currentSprint) return;

    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint first to update the issue");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("You can't drag an issue after a completed sprint");
      return;
    }

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newOrderData: Issue[] = [...(issues || [])];
    const sourceList = newOrderData.filter((list) => list.status === source.droppableId);
    const destinationList = newOrderData.filter((list) => list.status === destination.droppableId);

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(sourceList, source.index, destination.index);
      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId as IssueStatus;
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => (card.order = i));
      destinationList.forEach((card, i) => (card.order = i));
    }

    const sortedIssues = newOrderData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues);
    try {
      await updateIssueOrderFn(sortedIssues);
    } catch (error) {
      toast.error("Failed to update issue order");
      console.log(error);
      if (currentSprint?.id) {
        await fetchIssues(currentSprint.id);
      }
    }
  };

  const handleAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = async () => {
    if (currentSprint?.id) {
      await fetchIssues(currentSprint.id);
    }
  };

  const handleSprintChange = (sprintId: string) => {
    const newSprint = sprints.find((sprint) => sprint.id === sprintId);
    if (newSprint) {
      setCurrentSprint(newSprint);
    }
  };

  const handleIssueUpdate = async () => {
    if (currentSprint?.id) {
      await fetchIssues(currentSprint.id);
    }
  };

  const handleIssueDelete = async () => {
    if (currentSprint?.id) {
      await fetchIssues(currentSprint.id);
    }
  };

  // Error state
  if (issuesError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 dark:text-red-400 text-lg font-medium">
          Error loading issues: {issuesError.message}
        </div>
      </div>
    );
  }
  
  // Loading state for client-side rendering
  if (!isClient) {
    return (
      <div className="flex justify-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }
  
  // Loading state if sprint isn't set yet
  if (!currentSprint) {
    return (
      <div className="flex justify-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <SprintManager
            selectedSprint={currentSprint}
            setSelectedSprint={handleSprintChange}
            sprints={sprints}
            projectId={projectId}
          />
        </div>
        
        {updateIssuesError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg">
            {updateIssuesError.message}
          </div>
        )}
        
        {(updateIssuesLoading || issuesLoading) && (
          <div className="flex justify-center my-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        )}
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {typedStatusPro.map((column) => (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => (
                  <div className={`${column.bgColor} bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-200`}>
                    <div 
                      className="p-4 min-h-[150px]" 
                      ref={provided.innerRef} 
                      {...provided.droppableProps}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold dark:text-white">{column.name}</h2>
                        <button
                          onClick={() => handleAddIssue(column.key)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          aria-label={`Add issue to ${column.name}`}
                        >
                          <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {filteredIssues
                          .filter((issue) => issue.status === column.key)
                          .map((issue, index) => (
                            <Draggable key={issue.id} draggableId={issue.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <IssueCard 
                                    issue={issue} 
                                    showStatus={true} 
                                    onDelete={handleIssueDelete}
                                    onUpdate={handleIssueUpdate}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <CreateIssueDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          sprintId={currentSprint.id} 
          status={selectedStatus} 
          projectId={projectId} 
          onIssueCreated={handleIssueCreated} 
          orgId={orgId} 
        />
      </div>
    </div>
  );
};

export default SprintBoard;