import { Restaurant } from "./Restauran.model";

export type Reservation = {
    id:string;
    user?:string;
    venue?:string;
    time?:string;
    people?:number;
    status?:ReservationStatus;
    restaurant?:Restaurant
}

type ReservationStatus = {
    status:string;
}