import { UserPost } from "../models/user.model"
import { apiPost } from "./apiRestWrapper"

export const CreateUser = async (token:string): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "client"},customHeaders:{Authorization:`Bearer ${token}`} })
}
