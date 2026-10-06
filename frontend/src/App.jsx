import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Productdetails from "./pages/ProductDetails";
import AddProduct from "./admin/AddProduct";
import ProductList from "./admin/ProductList";
import EditProduct from "./admin/EditProduct";
import Layout from "./Layout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckOutAddress from "./pages/CheckOutAddress"
import OrderSuccess from "./pages/OrderSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/signup",
        element: <SignUp/>
      },
      {
        path: "/product/:id",
        element: <Productdetails/>
      },
      {
        path: "/admin/products",
        element: <ProductList/>
      },
      {
        path: "/cart",
        element: <Cart/>
      },
      {
        path: "/checkout-address",
        element: <CheckOutAddress/>
      },
      {
        path: "/checkout",
        element: <Checkout/>
      },
      {
        path: "order-success/:id",
        element: <OrderSuccess/>
      }
    ]
  },

  // for admin
  {
    path: "/admin/products/add",
    element: <AddProduct />
  },
  {
    path: "/admin/products/edit/:id",
    element: <EditProduct />
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}