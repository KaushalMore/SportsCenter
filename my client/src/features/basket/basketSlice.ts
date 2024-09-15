import { createSlice } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";

export interface BasketState {
    basket: Basket | null
}

const initialState: BasketState = {
    basket: null
}

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            console.log('new Basket state ', action.payload);
            state.basket = action.payload
        }
    }
})

export const { setBasket } = basketSlice.actions;