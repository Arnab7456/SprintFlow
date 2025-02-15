'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CreateSprintProps {
    projectTitle: string;
    projectKey: string;
    projectId: string;
    sprintKey: number;
}


export default function CreateSprint({ projectTitle, projectKey, projectId, sprintKey }: CreateSprintProps) {
    const [showForm, setShowForm] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <h2>Create Sprint</h2>
            <p>Project: {projectTitle}</p>
            <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">Create Sprint</Button>
            {showForm && (
                <form>
                    <input type="text" placeholder="Sprint Name" />
                    <input type="date" placeholder="Start Date" />
                    <input type="date" placeholder="End Date" />
                    <button type="submit">Create Sprint</button>
                </form>
            )}
            <p>Project Key: {projectKey}</p>
            <p>Project ID: {projectId}</p>
            <p>Sprint Key: {sprintKey}</p>
        </div>
    );
}