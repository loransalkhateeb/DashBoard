import {
  HomeIcon,
  UserCircleIcon,
  TagIcon, // Icon for Brands
  ServerStackIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  CreditCardIcon, // Using CreditCardIcon for Coupon Codes
} from "@heroicons/react/24/solid"; // Ensure you import the correct icon
import { Home, Profile, Notifications, Products } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Users from "./pages/dashboard/Users/Users";
import Brands from "./pages/dashboard/Brands/Brands";
import Codes from "./pages/dashboard/Codes/Codes";
import Orders from "./pages/dashboard/Orders/Orders";
import Slider from "./pages/dashboard/Slider/Slider";
import Feedback from "./pages/dashboard/Feedback/Feedback";
import WrapGift from "./pages/dashboard/WrapGift/WrapGift";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Users",
        path: "/users",
        element: <Users />,
      },
      {
        icon: <ShoppingBagIcon {...icon} />,
        name: "Products",
        path: "/products",
        element: <Products />,
      },
      // {
      //   icon: <TagIcon {...icon} />, // Icon for Brands
      //   name: "Brands",
      //   path: "/brands",
      //   element: <Notifications />, // Adjust this to the correct element if needed
      // },
      {
        icon: <TagIcon {...icon} />, // Icon for Brands
        name: "Brands",
        path: "/brands",
        element: <Brands />, // Adjust this to the correct element if needed
      },
      {
        icon: <CreditCardIcon {...icon} />, // Icon for Brands
        name: "Discount Codes",
        path: "/codes",
        element: <Codes />, // Adjust this to the correct element if needed
      },
      {
        icon: <CreditCardIcon {...icon} />, // Icon for Brands
        name: "Orders",
        path: "/orders",
        element: <Orders />, // Adjust this to the correct element if needed
      },
      {
        icon: <CreditCardIcon {...icon} />, // Icon for Brands
        name: "Wrap Gift",
        path: "/wrapgift",
        element: <WrapGift />, // Adjust this to the correct element if needed
      }, 
      {
        icon: <CreditCardIcon {...icon} />, // Icon for Brands
        name: "FeedBack",
        path: "/feedback",
        element: <Feedback />, // Adjust this to the correct element if needed
      }, 
       {
        icon: <CreditCardIcon {...icon} />, // Icon for Brands
        name: "Slider",
        path: "/slider",
        element: <Slider />, // Adjust this to the correct element if needed
      },
    ],
  },
  {
    title: "Auth Pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Sign Up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
