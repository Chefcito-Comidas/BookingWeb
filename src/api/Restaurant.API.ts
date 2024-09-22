import { RestaurantData } from "../models/Restauran.model"
import { apiGet } from "./apiRestWrapper"


export const getRestaurantById = async (id:string) => {
    return apiGet<RestaurantData>({url:`venues?limit=10&start=0&id=${id}`})
}