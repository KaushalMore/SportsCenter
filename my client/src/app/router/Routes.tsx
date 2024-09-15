import { createBrowserRouter, Navigate } from "react-router-dom";
import HomePage from '../../features/home/HomePage'
import Catalog from '../../features/catalog/Catalog'
import ContactPage from '../../features/contact/ContactPage'
import App from "../layout/App";
import ProductDetails from "../../features/catalog/ProductDetails";
import NotFound from "../errors/NotFoundError";
import ServerError from "../errors/ServerError";
import BasketPage from "../../features/basket/BasketPage";
import RegisterPage from "../../features/acoount/RegisterPage";
import SignInPage from "../../features/acoount/SingInPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth />, children: [
                    {path:'checkout', element:<CheckoutPage/>},
                ]
            },
            { path: '', element: <HomePage /> },
            { path: 'store', element: <Catalog /> },
            { path: 'store/:id', element: <ProductDetails /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'basket', element: <BasketPage /> },
            { path: 'login', element: <SignInPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
])