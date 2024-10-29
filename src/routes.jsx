import {
  HomeIcon,
  UserCircleIcon,
  TagIcon, // Icon for Brands
  ServerStackIcon,
  RectangleStackIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  WalletIcon,
  QrCodeIcon,
  GiftIcon ,
  ChatBubbleLeftEllipsisIcon ,
  PhotoIcon 
} from "@heroicons/react/24/solid"; // Ensure you import the correct icon
import { BiSolidCoupon } from "react-icons/bi";
import { Home, Products, Notifications } from "@/pages/dashboard";

// import { Home,  Notifications, Products } from "@/pages/dashboard";

import { SignIn, SignUp } from "@/pages/auth";
import Users from "./pages/dashboard/Users/Users";
import Brands from "./pages/dashboard/Brands/Brands";
import Codes from "./pages/dashboard/Codes/Codes";
import Orders from "./pages/dashboard/Orders/Orders";
import Slider from "./pages/dashboard/Slider/Slider";
import Feedback from "./pages/dashboard/Feedback/Feedback";
import WrapGift from "./pages/dashboard/WrapGift/WrapGift";
import Wallet from "./pages/dashboard/Wallet/Wallet";

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
        icon: <BiSolidCoupon {...icon} />, // Icon for Brands
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
        icon: <WalletIcon {...icon} />, // Icon for Brands
        name: "Wallet",
        path: "/wallet",
        element: <Wallet />, // Adjust this to the correct element if needed
      },
      {
        icon: <GiftIcon {...icon} />, // Icon for Brands
        name: "Wrap Gift",
        path: "/wrapgift",
        element: <WrapGift />, // Adjust this to the correct element if needed
      }, 
      {
        icon: <ChatBubbleLeftEllipsisIcon  {...icon} />, // Icon for Brands
        name: "FeedBack",
        path: "/feedback",
        element: <Feedback />, // Adjust this to the correct element if needed
      }, 
       {
        icon: <PhotoIcon  {...icon} />, // Icon for Brands
        name: "Slider",
        path: "/slider",
        element: <Slider />, // Adjust this to the correct element if needed
      },
    ],
  },
  // {
  //   title: "Auth Pages",
  //   layout: "auth",
  //   pages: [
  //     // {
  //     //   icon: <ServerStackIcon {...icon} />,
  //     //   name: "Sign In",
  //     //   path: "/sign-in",
  //     //   element: <SignIn />,
  //     // },
  //     // {
  //     //   icon: <RectangleStackIcon {...icon} />,
  //     //   name: "Sign Up",
  //     //   path: "/sign-up",
  //     //   element: <SignUp />,
  //     // },
  //   ],
  // },
];

export default routes;
