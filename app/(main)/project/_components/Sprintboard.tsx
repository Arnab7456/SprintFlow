"use client";

import { useState, useEffect } from "react";
import SprintManager from "./SprintManger";
import { Sprint } from "@/lib/types/sprint.d";
import CreateIssueDrawer from "./Create-issue-drawer";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Loader2, Plus } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { getIssues, updateIssueStatus } from "@/actions/Issues";
import IssueCard from "@/components/IssueCard";
import { toast } from "sonner";

type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

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

interface Issue {
  id: string;
  status: IssueStatus;
  order: number;
}

const reorder = (list: Issue[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// Enhanced status columns with color schemes
const typedStatusPro: StatusColumn[] = [
  { key: "TODO", name: "To Do", bgColor: "border-r-4 border-blue-400 dark:border-blue-500" },
  { key: "IN_PROGRESS", name: "In Progress", bgColor: "border-r-4 border-yellow-400 dark:border-yellow-500" },
  { key: "IN_REVIEW", name: "In Review", bgColor: "border-r-4 border-purple-400 dark:border-purple-500" },
  { key: "DONE", name: "Done", bgColor: "border-r-4 border-green-400 dark:border-green-500" }
];

export const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>("TODO");
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  
  const {
    fn: fetchIssues,
    loading: issuesLoading,
    data: issues = [], // Ensure issues is always an array
    setData: setIssues,
    error: issuesError
  } = useFetch(getIssues);

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueStatus);

  useEffect(() => {
    fetchIssues(currentSprint.id);
  }, [currentSprint.id]);

  useEffect(() => {
    setFilteredIssues(issues);
  }, [issues]);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

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

    const newOrderData: Issue[] = [...issues]; // Ensure issues is always an array
    const sourceList = newOrderData.filter((list) => list.status === source.droppableId);
    const destinationList = newOrderData.filter((list) => list.status === destination.droppableId);

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(sourceList, source.index, destination.index);
      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => (card.order = i));
      destinationList.forEach((card, i) => (card.order = i));
    }

    const sortedIssues : any = newOrderData.sort((a, b) => a.order - b.order);
    setIssues(sortedIssues);
    updateIssueOrderFn(sortedIssues);
  };

  const handelAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handelIssueCreated = () => {
    fetchIssues(currentSprint.id);
  };

  const handleSprintChange = (sprintId: string) => {
    const newSprint = sprints.find((sprint) => sprint.id === sprintId);
    if (newSprint) {
      setCurrentSprint(newSprint);
    }
  };

  if (issuesError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 dark:text-red-400 text-lg font-medium">
          Error loading issues
        </div>
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
        
        {updateIssuesError && <p className="text-red-500 mt-2">{updateIssuesError.message}</p>}
        
        {(updateIssuesLoading || issuesLoading) && <Loader2 className="mt-4" width={"100%"} color="#36d7b7" />}
        
        {issuesLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {typedStatusPro.map((column) => (
                <Droppable key={column.key} droppableId={column.key}>
                  {(provided) => (
                    <div className={`${column.bgColor} rounded-lg shadow-sm transition-all duration-200`}>
                      <div className="p-4 min-h-[150px]" ref={provided.innerRef} {...provided.droppableProps}>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold dark:text-white">{column.name}</h2>
                          <button
                            onClick={() => handelAddIssue(column.key)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
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
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <IssueCard issue={issue} showStatus={true} onDelete={() => {}} onUpdate={() => {}} />
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
        )}

        <CreateIssueDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} sprintId={currentSprint.id} status={selectedStatus} projectId={projectId} onIssueCreated={handelIssueCreated} orgId={orgId} />
      </div>
    </div>
  );
};
