import { getProjects } from "@/actions/Project";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProjectList({ orgId }: { orgId: string }) {
    const projects = await getProjects(orgId);

    // If no projects, show the empty state
    if (projects.length === 0) {
        return (
            <div className="text-center py-8">
                <h3 className="text-xl font-medium mb-4">No projects found</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first project</p>
                <Link href="/project/create">
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Create a project
                    </Button>
                </Link>
            </div>
        );
    }

    // If there are projects, show the grid
    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Link href="/project/create">
                    <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Create New Project
                    </Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                    <Card key={project.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{project.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Key: {project.key}
                            </p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">
                                {project.description || "No description provided"}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/project/${project.id}`} className="w-full">
                                <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    View Project
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}