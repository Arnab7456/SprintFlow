"use server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma"
export const checkUser = async () => {
    const user = await currentUser();
    if(!user) {
        return null
    }
    try {
        const logger = await db?.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })
        if  (logger){
            return logger;
        }
        const name = user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : user.username;
        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: name,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
            }
        })
        return newUser;
    }   catch (error) {
        console.log(error)
        return null
    }
}