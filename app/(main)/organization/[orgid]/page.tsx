import { getOrganization } from "@/actions/organization";
import OrgSwitch from "@/components/org-switch";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProjectList from "./_components/Projectlist";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";

export interface PageProps {
  params?: any;
  searchParams?: any;
}

export default async function Organization({ params }: PageProps) {
  const session = await auth();
  if (!session?.userId) {
    redirect("/sign-in");
  }
  
  const orgid = await params?.orgid ?? 'loading...';
  const organization = await getOrganization(orgid);
  
  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6">
          <div className="text-center text-gray-500">
            <Building2 className="mx-auto h-12 w-12 mb-4" />
            <h2 className="text-xl font-semibold">Organization Not Found</h2>
            <p className="mt-2">The requested organization could not be found.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-36 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-4xl font-bold tracking-tight gradient-title">
                {organization.name}
              </h1>
              <p className="text-gray-500">
                Manage your organization's projects and team members
              </p>
            </div>
            <OrgSwitch />
          </div>
          <Separator className="my-6" />
        </div>

        <div className="grid gap-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Projects</h2>
              <ProjectList orgId={orgid} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Organization Members</h2>
              <div className="text-gray-500">
                View and manage members of this organization
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}