"use client";

import { useState } from "react";
import SprintManager from "./SprintManger";
import { Sprint } from "@/lib/types/sprint.d";
import CreateIssueDrawer from "./Create-issue-drawer";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import statusPro from "../../../../data/statusPro.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Define the IssueStatus type based on your status options
type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

interface SprintBoardProps {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
}

interface StatusColumn {
  key: IssueStatus;
  name: string;
}

// Type assertion for statusPro to ensure it matches our StatusColumn type
const typedStatusPro = statusPro as StatusColumn[];

export const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Initialize with "TODO" instead of null
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>("TODO");

  const onDragEnd = () => {
    // Your drag end logic here
  };

  const handelAddIssue = (status: IssueStatus) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handelIssueCreated = () => {
    // Your issue created logic here
  };

  const handleSprintChange = (sprintId: string) => {
    const newSprint = sprints.find((sprint) => sprint.id === sprintId);
    if (newSprint) {
      setCurrentSprint(newSprint);
    }
  };

  return (
    <div className="">
      <SprintManager
        selectedSprint={currentSprint}
        setSelectedSprint={handleSprintChange}
        sprints={sprints}
        projectId={projectId}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 rounded-lg">
          {typedStatusPro.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  className="space-y-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="text-lg font-semibold mb-2">{column.name}</h2>
                  {provided.placeholder}
                  {column.key === "TODO" && currentSprint.status !== "COMPLETED" && (
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => handelAddIssue(column.key)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      ADD ISSUE
                    </Button>
                  )}
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
        onIssueCreated={handelIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};