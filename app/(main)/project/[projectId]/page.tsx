import { FetchProject } from "@/actions/Project";
import { Building2 } from "lucide-react";
import CreateSprintPage from "../_components/CreateSprint";
import { SprintBoard } from "../_components/Sprintboard";

// Define the PageProps interface
interface PageProps {
  params?: any;
  searchParams?: any;
}
const ProjectPage = async ({ params }: PageProps) => {
  const { projectId } = await params;

  // Fetch project data
  const projectData = await FetchProject(projectId);

  // Handle project not found
  if (!projectData || !projectData.success) {
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

  const { project } = projectData;

  return (
    <div className="min-h-screen">
      {/* Create Sprint Component */}
      <CreateSprintPage
        projectTitle={project.name}
        projectKey={project.key}
        projectId={params.projectId}
        sprintKey={1}
      />

      {/* Sprint Board or Empty State */}
      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={params.projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div className="flex items-center justify-center p-6 mt-4 text-muted-foreground">
          Create a Sprint from the button above
        </div>
      )}
    </div>
  );
};

export default ProjectPage;