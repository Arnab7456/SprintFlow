"use client";

import { useState } from "react";
import SprintManager from "./SprintManger";
import { Sprint } from "@/lib/types/sprint.d";

interface SprintBoardProps {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
}

export const SprintBoard = ({ sprints, projectId,  }: SprintBoardProps) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((sprint) => sprint.status === "ACTIVE") || sprints[0]
  );

  const handleSprintChange = (sprintId: string) => {
    const newSprint = sprints.find((sprint) => sprint.id === sprintId);
    if (newSprint) {
      setCurrentSprint(newSprint);
    }
  };

  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        selectedSprint={currentSprint}
        setSelectedSprint={handleSprintChange}
        sprints={sprints}
        projectId={projectId}
        
      />

      {/* kanban board */}
    </div>
  );
};