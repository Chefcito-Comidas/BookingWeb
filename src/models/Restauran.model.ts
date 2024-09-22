export type RestaurantData = {
    result:Restaurant[];
    total:number
}

export type Restaurant =  {
    id:string;
    name:string;
    location:string
    logo:string;
    pictures:string[];
    slots:string[];
    capacity:number;
    reservationLeadTime:number;
    characteristics:string[];
    vacations:string[];
    status:Status;
}

type Status = {
    status:string;
}

