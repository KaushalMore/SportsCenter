import { Order } from "./order";

export interface User {
    id: number;
    username: string;
    token: string;
    email: string;
    role: string;
    orderList: Order[];
}