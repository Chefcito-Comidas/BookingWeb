import { UserPost } from "../models/user.model"
import { apiPost } from "./apiRestWrapper"

export const CreateUser = async (token:string,name:string,phone:string): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "client",number:phone,name:name},customHeaders:{Authorization:`Bearer ${token}`} })
}
