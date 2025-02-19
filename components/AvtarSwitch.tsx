import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from '@clerk/nextjs/server'

const AvatarSwitch = ({user}: {user: User}) => {
    const name = user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.username;
    return (
        <div className=' flex items-center space-x-2 w-full'>
        <Avatar className='w-8 h-8'>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className='capitalize'>{name?.charAt(0) || ''}</AvatarFallback>
        </Avatar>
        <span className='text-xs text-muted-foreground'>
            {name}</span>
        </div>
    )
}

export default AvatarSwitch