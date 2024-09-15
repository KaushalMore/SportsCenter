import { Basket } from "../models/basket";
import { Product } from "../models/product";

export function getBasketFromLocalStorage():Basket | null{
    const storedBasket = localStorage.getItem('basket');
    if (storedBasket){
        try{
            const parsedBasket: Basket = JSON.parse(storedBasket);
            return parsedBasket;
        }
        catch(error){
            console.error('Error Parsing basket from local storage: ', error);
            return null;
        }
    }
    return null;
}

const extractImageName = (item: Product): string | null => {
    if (item && item.pictureUrl) {
        const parts = item.pictureUrl.split('/');
        if (parts.length > 0) {
            return parts[parts.length - 1];
        }
    }
    return null;
};

// Function to format the price with INR currency symbol
const formatPrice = (price: number): string =>{
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(price);
};


 function formatDate(orderDateArray: any) {
    if (!Array.isArray(orderDateArray) || orderDateArray.length < 3) {
        return "Invalid Date";
    }
    const [year, month, day] = orderDateArray;
    const formattedDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    return formattedDate;
} 

export {
    extractImageName,
    formatPrice,
    formatDate
};