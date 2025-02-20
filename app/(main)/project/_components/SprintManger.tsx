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
import { motion } from "framer-motion";
import { Calendar, PlayCircle, StopCircle } from "lucide-react";

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

  const getStatusBadgeColor = () => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  return (
    <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-4 px-4 py-2 bg-background rounded-lg shadow-md dark:border dark:border-gray-700"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4 sm:gap-2 justify-start items-center sm:items-center">
        <Select value={selectedSprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="w-full min-w-[280px] px-4 py-6 bg-card text-foreground border border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{sprint.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                  {format(new Date(sprint.startDate), "MMM d")} - {format(new Date(sprint.endDate), "MMM d, yyyy")}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary"
            className={`${getStatusBadgeColor()} text-xs font-medium px-2 py-1`}
          >
            {status}
          </Badge>
          {getStatusText() && (
            <Badge 
              variant="outline" 
              className="text-xs font-medium px-2 py-1"
            >
              {getStatusText()}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <StopCircle className="h-4 w-4" />
            End Sprint
          </Button>
        )}
      </div>
    </div>

    {loading && (
      <div className="w-full">
        <BarLoader width="100%" className="mt-2" color="#36d7b7" />
      </div>
    )}
  </motion.div>
);
};

export default SprintManager;