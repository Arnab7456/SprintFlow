
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { getUserIssue } from "@/actions/Issues";
import IssueCard from "@/components/IssueCard";

export const UserIssueList = async ({ userId }: { userId: string }) => {
    const issues = await getUserIssue(userId);
    if (!issues) return null;
    
    const assignedIssues = issues.filter((issue: any) => issue.assignee?.clerkUserId === userId);
    const reportedIssues = issues.filter((issue: any) => issue.reporter?.clerkUserId === userId);
  return (
    <div>
        <h1 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
            User Issues
        </h1>
      <Tabs defaultValue="Assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="Assigned">Assigned to me</TabsTrigger>
          <TabsTrigger value="Reported">Reported by me</TabsTrigger>
        </TabsList>
        <TabsContent value="Assigned">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>
        <TabsContent value="Reported">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function IssueGrid({ issues }: { issues: any }) {
    return (
        <div className="grid gap-4 sm:gap-8">
            {issues.map((issue: any) => (
                <IssueCard 
                key={issue.id} 
                issue={issue} 
                showStatus={true}
            />
            ))}
        </div>
    ); 
}
