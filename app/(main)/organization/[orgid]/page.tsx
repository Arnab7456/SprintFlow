import { getOrganization } from "@/actions/organization";
import OrgSwitch from "@/components/org-switch";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProjectList from "./_components/Projectlist";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";
import { UserIssueList } from "./_components/User-Issue";
export interface PageProps {
  params?: any;
  searchParams?: any;
}

export default async function Organization({ params }: PageProps) {
  const session = await auth();
  if (!session?.userId) {
    redirect("/sign-in");
  }
  const userId = session?.userId;

  const orgid = (await params?.orgid) ?? "loading...";
  const organization = await getOrganization(orgid);

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <div className="text-center p-6">
            <Building2 className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Organization Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The requested organization could not be found.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full sm:w-auto space-y-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-title break-words max-w-full">
                {organization.name}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage your organization's projects and team members
              </p>
            </div>
            <div className="w-full sm:w-auto flex justify-center">
              <OrgSwitch />
            </div>
          </div>
          <Separator className="hidden sm:block my-6" />
        </div>

        <div className="grid gap-4 sm:gap-8">
          <Card className="border backdrop-blur-lg sm:border shadow-none sm:shadow">
            <CardContent className="p-2 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
                Projects
              </h2>
              <ProjectList orgId={orgid} />
            </CardContent>
          </Card>

          <Card className="border sm:border shadow-none sm:shadow">
            <CardContent className="p-2 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
                Organization sprints 
              </h2>
              <div className="text-muted-foreground text-sm sm:text-base">
                <UserIssueList userId={userId} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
