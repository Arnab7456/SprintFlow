export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: SprintStatus;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Project {
    id: string;
    name: string;
    key: string;
    sprints: Sprint[];
  }

  export interface ProjectResponsetypes {
    success: boolean;
    project: Project;
  }
