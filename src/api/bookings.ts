import { apiPost } from "./apiRestWrapper"
import {NewBookingPost} from "../models/NewBooking.model";

export const PostBooking = async (value:NewBookingPost,token:string) => {
    return apiPost<any>({ url: `reservations`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}
