"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners";
import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns";
import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprint, SprintStatus } from "@/lib/types/sprint.d";
import { updateSprintStatus } from "@/actions/Sprint";

interface SprintManagerProps {
  selectedSprint: Sprint;
  setSelectedSprint: (sprintId: string) => void;
  sprints: Sprint[];
  projectId: string;
}

interface UpdateSprintResponse {
  success: boolean;
  sprint: Sprint;
}

const SprintManager = ({
  selectedSprint,
  setSelectedSprint,
  sprints,
  projectId,
}: SprintManagerProps) => {
  const [status, setStatus] = useState<SprintStatus>(selectedSprint.status);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch<UpdateSprintResponse>(updateSprintStatus);

  useEffect(() => {
    setStatus(selectedSprint.status);
  }, [selectedSprint.status]);

  const startDate = new Date(selectedSprint.startDate);
  const endDate = new Date(selectedSprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
  const canEnd = status === "ACTIVE";

  const handleStatusChange = async (newStatus: SprintStatus) => {
    updateStatus(selectedSprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSelectedSprint(updatedStatus.sprint.id);
    }
  }, [updatedStatus, loading, setSelectedSprint]);

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== selectedSprint.id) {
      setSelectedSprint(sprintId);
    }
  }, [searchParams, sprints, selectedSprint.id, setSelectedSprint]);

  const handleSprintChange = useCallback(
    (value: string) => {
      setSelectedSprint(value);
      router.replace(`/project/${projectId}`);
    },
    [projectId, router, setSelectedSprint]
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-background rounded-lg shadow-md dark:border dark:border-gray-700">
      <div className="flex justify-between items-center gap-4">
        <Select value={selectedSprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="w-full md:w-auto bg-card text-foreground border border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                {sprint.name} ({format(new Date(sprint.startDate), "MMM d, yyyy")} to {format(new Date(sprint.endDate), "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          {canStart && (
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Start Sprint
            </Button>
          )}
          {canEnd && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={loading}
              variant="destructive"
            >
              End Sprint
            </Button>
          )}
        </div>
      </div>
      {loading && <BarLoader width="100%" className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <Badge variant="default" className="mt-3">
          {getStatusText()}
        </Badge>
      )}
    </div>
  );
};

export default SprintManager;
