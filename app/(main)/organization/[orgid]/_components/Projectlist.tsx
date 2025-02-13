import { getProjects } from "@/actions/Project";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteProject from "./DeleteProject";
import { Plus, Layout, ArrowRight } from "lucide-react";

export default async function ProjectList({ orgId }: { orgId: string }) {
    const projects = await getProjects(orgId);

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Layout className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-8">
                    Get started by creating your first project to organize your work
                </p>
                <Link href="/project/create">
                    <Button 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create your first project
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your Projects</h2>
                <Link href="/project/create">
                    <Button 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card 
                        key={project.id} 
                        className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-800"
                    >
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-semibold line-clamp-1">
                                    {project.name}
                                </CardTitle>
                                <DeleteProject projectId={project.id} />
                            </div>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs text-blue-600 dark:text-blue-400 font-medium">
                                {project.key}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground line-clamp-2">
                                {project.description || "No description provided"}
                            </p>
                        </CardContent>
                        <CardFooter className="pt-4">
                            <Link href={`/project/${project.id}`} className="w-full">
                                <Button 
                                    variant="outline"
                                    className="w-full group-hover:bg-blue-50 group-hover:text-blue-700 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-200 transition-colors duration-200"
                                >
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}