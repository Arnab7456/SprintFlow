import { getOrganization } from "@/actions/organization";
import OrgSwitch from "@/components/org-switch";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProjectList from "./_components/Projectlist";

export interface PageProps {
  params?: any;  
  searchParams?: any;
}

export default async function Organization({ params }: PageProps) {
  const session = await auth();
  if (!session?.userId) {
    redirect("/sign-in");
  }
  const orgid =  await params?.orgid ?? 'loading...';
  const organization = await getOrganization(orgid);
  if (!organization) {
    return <div>Organization not found</div>;
  }
  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitch />
      </div>
      <div className="mb-4">
        <ProjectList orgId={orgid} />
      </div>
      <div className="mt-8">
      projects member of this org
      </div>
    </div>
  )
}