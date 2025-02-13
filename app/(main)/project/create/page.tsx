'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { projectSchema } from "@/lib/form/validator";
import { createProject } from "@/actions/Project";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import OrgSwitcher from "@/components/org-switch";
import { z } from "zod";

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");  
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  const onSubmit = async (data: ProjectFormData) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }
    await createProjectFn(data);
  };

  useEffect(() => {
    if (project) {
      router.push(`/project/${project.id}`);
    }
  }, [project, router]); 

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-6xl text-center font-bold mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
        Create New Project
      </h1>

      <Card className="max-w-2xl mx-auto border border-border/40 dark:bg-slate-900/50 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-center text-foreground/80">
            Enter Project Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground/70">
                Project Name
              </label>
              <Input
                id="name"
                {...register("name")}
                className="border-border/30 bg-background/50 focus:border-blue-500 transition-colors"
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="key" className="text-sm font-medium text-foreground/70">
                Project Key
              </label>
              <Input
                id="key"
                {...register("key")}
                className="border-border/30 bg-background/50 focus:border-blue-500 transition-colors"
                placeholder="Ex: RCYT"
              />
              {errors.key && (
                <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground/70">
                Description
              </label>
              <Textarea
                id="description"
                {...register("description")}
                className="border-border/30 bg-background/50 focus:border-blue-500 transition-colors h-28 resize-none"
                placeholder="Describe your project..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {loading && (
              <div className="flex justify-center">
                <BarLoader color="rgb(59, 130, 246)" width="100%" />
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
            >
              {loading ? "Creating..." : "Create Project"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error.message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}