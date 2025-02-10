import { getOrganization } from "@/actions/organization";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
    <div className=" container mx-auto mt-5">
      <h1>{organization.name}</h1>
      <div className="mb-4">
        Show organization projects
      </div>
      <div className="mt-4">
        Show organization members
      </div>
    </div>
  )
}
