import { formatDistanceToNow } from "date-fns"
import AvatarSwitch from "./AvtarSwitch"
import { Badge } from "./ui/badge"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card"

// type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

// const PriorityColor: Record<Priority, string> = {
//     LOW: "border-green-500/50",
//     MEDIUM: "border-yellow-500/50",
//     HIGH: "border-red-500/50",
//     URGENT: "border-purple-500/50"
// }
interface IssueCardProps {
    issue: any
    showStatus: boolean
    onDelete: () => void
    onUpdate: () => void
}
const IssueCard = ({ issue, showStatus}: IssueCardProps) => {
    const created = formatDistanceToNow(new Date(issue.createdAt), {
        addSuffix: true
    })
    const borderColor ="border-gray-500/50"

    return (
        <Card className={`relative hover:shadow-md transition-shadow duration-200  ${borderColor} border-l-4`}>
            <CardHeader className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                        {issue.title}
                    </CardTitle>
                    {showStatus && (
                        <Badge 
                            variant={issue.status === 'CLOSED' ? 'secondary' : 'outline'}
                            className="shrink-0 capitalize"
                        >
                            {issue.status.toLowerCase()}
                        </Badge>
                    )}
                </div>
                
                <CardDescription className="text-muted-foreground text-sm line-clamp-3">
                    {issue.description}
                </CardDescription>
            </CardHeader>

            {showStatus && (
                <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="px-2 py-1 text-sm">
                            <span className="text-muted-foreground">Priority:</span>
                            <span className="ml-1 font-medium capitalize">{issue.priority.toLowerCase()}</span>
                        </Badge>
                        
                        {issue.assignee && (
                            <Badge variant="outline" className="px-2 py-1 text-sm">
                                <span className="text-muted-foreground">Assignee:</span>
                                <span className="ml-1 font-medium">{issue.assignee?.name}</span>
                            </Badge>
                        )}
                    </div>
                </CardContent>
            )}

            <CardFooter className="p-4 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {issue.assignee && (
                        <>
                            <AvatarSwitch 
                                user={issue.assignee} 
                            />
                            <span className="text-sm text-muted-foreground">
                                {issue.assignee.name}
                            </span>
                        </>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">
                    Created {created}
                </div>
            </CardFooter>
        </Card>
    )
}

export default IssueCard