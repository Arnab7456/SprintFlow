import { FetchProject } from "@/actions/Project";
import { Building2 } from "lucide-react";
const ProjectPage = async ({ params }: { params: { projectId: string } }) => {
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto space-y-1 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-title break-words max-w-full">
              Project: {project.project.name}
            </h1>
            <p className="text-muted-foreground">
              View and manage your project
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <p className="text-muted-foreground">Project ID: {projectId}</p>
          </div>
        </div>

        <div className="mt-4 max-w-2xl">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.project.description || "No description provided"}
          </p>
        </div>
        <div>sprint creation</div>
        <div>sprint list</div>
        <div>issue creation</div>
        <div>issue list</div>
      </div>
    </div>
  );
};

export default ProjectPage;
