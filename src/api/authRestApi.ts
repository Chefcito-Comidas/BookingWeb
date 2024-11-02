import { UserPost } from "../models/user.model"
import { apiPost } from "./apiRestWrapper"

export const CreateUser = async (token:string,phone?:any): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "client",phone:phone??''},customHeaders:{Authorization:`Bearer ${token}`} })
}
