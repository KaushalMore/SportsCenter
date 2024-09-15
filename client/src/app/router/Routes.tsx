import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import ProductDetails from "../../features/catalog/ProductDetails";
import NotFound from "../errors/NotFoundError";
import ServerError from "../errors/ServerError";
import BasketPage from "../../features/basket/BasketPage";
import SignInPage from "../../features/account/SignInPage";
import RegisterPage from "../../features/account/RegisterPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import Order from "../../features/orders/Order";
import AddProduct from "../../features/admin/AddProduct";
import ProductTable from "../../features/admin/ProductTable";
import UpdateProduct from "../../features/admin/UpdateProduct";
import OrderDetails from "../../features/orders/OrderDetails";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                // this is accessible to all user
                element: <RequireAuth />, children: [
                    { path: 'checkout', element: <CheckoutPage /> },
                    { path: 'orders', element: <Order /> },
                ]
            },
            { path: '', element: <HomePage /> },
            { path: 'store', element: <Catalog /> },
            { path: 'store/:id', element: <ProductDetails /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'basket', element: <BasketPage /> },
            { path: 'login', element: <SignInPage /> },
            { path: 'register', element: <RegisterPage /> },

            // admin
            { path: 'all-product', element: <ProductTable /> },
            { path: 'add-product', element: <AddProduct /> },
            { path: 'update/:id', element: <UpdateProduct /> },
            { path: 'order-details', element: <OrderDetails /> },

            // error handling
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: '*', element: <Navigate replace to='/not-found' /> }
        ]
    }
])