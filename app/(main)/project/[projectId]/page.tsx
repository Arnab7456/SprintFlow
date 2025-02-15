import { FetchProject } from "@/actions/Project";
import { Building2 } from "lucide-react";
import CreateSprint from "../_components/CreateSprint";

export interface PageProps {
  params?: any;
  searchParams?: any;
}

const ProjectPage = async ({ params }: PageProps) => {
  const { projectId } = params;
  const project = await FetchProject(projectId);
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center p-6">
          <Building2 className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Project Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The requested project could not be found.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <CreateSprint projectTitle={project.project.name} projectKey={project.project.key} projectId={projectId} sprintKey={1} />
    </div>
  );
};

export default ProjectPage;
