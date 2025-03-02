import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export type User = {
    id: string;
    clerkUserId: string;
    name?: string | null;
    email?: string;
    imageUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
interface UserAvatarProps {
  user: User | null; // Handle null case explicitly
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <div className="flex items-center space-x-2 w-full">
      <Avatar className="h-6 w-6">
        <AvatarImage 
          src={user?.imageUrl || ""} 
          alt={user?.name || "User avatar"} 
        />
        <AvatarFallback className="capitalize">
          {user?.name?.[0] || "?"}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-500">
        {user?.name || "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;