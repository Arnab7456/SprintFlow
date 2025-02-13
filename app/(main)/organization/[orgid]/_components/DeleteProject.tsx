'use client'
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteProject } from "@/actions/Project";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DeleteProject = ({ projectId }: { projectId: string }) => {
    const {membership} = useOrganization();
    const isAdmin = membership?.role === "org:admin";
    const router = useRouter();

    const {
        loading: isDeleting,
        error,
        fn: deleteProjectFn,
        data: deleted,
      } = useFetch(deleteProject);

    const onDelete = async () => {
            if(window.confirm("Are you sure you want to delete this project?")) {
                await deleteProjectFn(projectId);
            }
    }
    useEffect(()=>{
        if(deleted) {
            toast.success("Project deleted");
                router.refresh();
        }
    },[deleted])

   if(isDeleting || !isAdmin) return null;
    return (
        <>
            <Button
        variant="ghost"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </>
    )
}

export default DeleteProject;