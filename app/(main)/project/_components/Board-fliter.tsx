"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import existing types
import { Issue } from "./Sprintboard"; 

interface User {
    id: string;
    clerkUserId: string;
    name?: string | null;
    email?: string;
    imageUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

interface BoardFiltersProps {
  issues: Issue[];
  onFilterChange: (filteredIssues: Issue[]) => void;
}

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export default function BoardFilters({ issues, onFilterChange }: BoardFiltersProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
      (item, index, self) => 
        item !== null && 
        index === self.findIndex((t) => t !== null && t.id === item.id)
    ) as User[];

  // Apply filters immediately when filter criteria change
  useEffect(() => {
    if (!issues || issues.length === 0) return;
    
    // Always apply the filtering logic, even if no filters are set
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          (issue.assignee !== null && selectedAssignees.includes(issue.assignee.id))) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
    );
    
    // Always call onFilterChange with the filtered results
    onFilterChange(filteredIssues);
    
  }, [searchTerm, selectedAssignees, selectedPriority, issues]);
  // Note: We need to keep onFilterChange out of dependencies to avoid the loop

  const toggleAssignee = (assigneeId: string) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };

  const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

  return (
    <div className="space-y-4">
      <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
          className="w-full sm:w-72"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
              if (!assignee) return null;
              const selected = selectedAssignees.includes(assignee.id);
              return (
                <div
                  key={assignee.id}
                  className={`rounded-full ring ${
                    selected ? "ring-blue-600" : "ring-black"
                  } ${i > 0 ? "-ml-6" : ""}`}
                  style={{
                    zIndex: i,
                  }}
                  onClick={() => toggleAssignee(assignee.id)}
                >
                  <Avatar className="h-10 w-10">
                    {assignee.imageUrl ? (
                      <AvatarImage src={assignee.imageUrl} />
                    ) : (
                      <AvatarFallback>
                        {assignee.name ? assignee.name[0] : "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}