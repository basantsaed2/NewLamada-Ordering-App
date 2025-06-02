import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import {
  LoginPage,
  SignUpPage,
  HomePage,
  MenuPage,
  ContactUsPage,
  CartPage,
  CheckOutPage,
  NotFoundPage,
  ForgotPasswordPage,
  OtpVerificationPage,
  ProfilePage,
  FavoritesPage,
  ProductDetails,
  DealsPage,
  AddLocationPage,
  OrdersPage,
  UpComingOrders,
  HistoryOrders,
  OrderTraking,
  Branch,
  NewHomePage,
  NewMenuPage,
  LandingPage,
} from "./Pages/page";
import ProtectedLogin from "./ProtectedData/ProtectedLogin";
import { AuthLayout } from "./Layouts/Layouts";
import AddNewAddress from "./Pages/CheckOut/Sections/AddNewAddress";

export const router = createBrowserRouter(
  [
    {
      path: '',
      element: <App />,
      children: [
        // Authentication
        {
          path: 'auth',
          element: <ProtectedLogin />,
          children: [{

            path: '',
            element: <AuthLayout />,
            children: [

              {
                path: 'login',
                element: <LoginPage />
              },
              {
                path: 'sign_up',
                element: <SignUpPage />
              },
            ],
          }
          ]
        },
        {
          path: 'profile',
          // element: <ProfilePage />,
          element: <ProtectedLogin />,
          children: [
            {
              path: '',
              element: <ProfilePage />,

            }
          ]
        },
        {
          path: 'add_location',
          element: <ProtectedLogin />,
          children: [
            {
              path: '',
              element: <AddLocationPage />,

            }
          ]
        },
        // {
        //   path: '',
        //   element: <HomePage />,
        // },
        {
          path: 'home',
          element: <NewHomePage />,
        },
        {
          path: '',
          element: <NewHomePage />,
        },
        {
          path:'location',
          element:<LandingPage/>
        },
        {
          path: 'menu',
          element: <MenuPage />,
        },
        {
          path: 'Lamada_menu',
          element: <NewMenuPage />,
        },
        {
          path: 'branches',
          element: <Branch />,
        },
        {
          path: 'contact_us',
          element: <ContactUsPage />,
        },
        {
          path: 'favorites',
          element: <ProtectedLogin />,
          children: [
            {
              path: '',
              element: <FavoritesPage />,

            }
          ]
        },
        {
          path: 'deals',
          element: <DealsPage />,
        },
        {
          path: '/product/:productId',
          element: <ProductDetails />,
        },
        {
          path: 'cart',
          element: <CartPage />,
        },
        {
          path: 'check_out',
          element: <ProtectedLogin />,
          children: [
            {
              path: '',
              element: <CheckOutPage />,
            },
            {
              path: 'add_address',
              element: <AddNewAddress />,
            }
          ]
        },
        {
          path: 'orders',
          element: <ProtectedLogin />,
          children: [
            {
              path: '',
              element: <OrdersPage />,
              children: [
                {
                  path: '',
                  element: <UpComingOrders />,
                },
                {
                  path: 'history',
                  element: <HistoryOrders />,
                },
                {
                  path: 'order_traking/:orderId',
                  element: <OrderTraking />,
                }
              ]

            }
          ]
        },
      ],
    },
    /* Catch-all for 404 */
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ],
);
