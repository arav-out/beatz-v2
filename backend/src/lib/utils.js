import {User } from "../models/user.model.js"
export const getAuthUser = async(clerkId) =>{
    const user = await User.findOne({ clerkId:clerkId })
    return user ? user : null
}