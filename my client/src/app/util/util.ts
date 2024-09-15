import { Basket } from "../models/basket";

export function getBasketFromLocalStorage(): Basket | null {
    const storeBasket = localStorage.getItem('basket');
    if (storeBasket) {
        try {
            const parsedBasket: Basket = JSON.parse(storeBasket);
            return parsedBasket;
        } catch (error) {
            console.error('Error parsing basket from localstoarage : ', error);
            return null;
        }
    }
    return null;
}

// export function getThemeFromLocalStorage(): Boolean {
//     const storeTheme = localStorage.getItem('theme');
//     if (storeTheme) {
//         try {
//             const parsedBasket: Boolean = JSON.parse(storeTheme);
//             return parsedBasket;
//         } catch (error) {
//             console.error('Error parsing theme from localstoarage : ', error);
//             return false;
//         }
//     }
//     return false;
// }