import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineDashboard,
  AiOutlineAppstore,
  AiOutlineTags,
  AiOutlineOrderedList,
  AiOutlineUser,
  AiOutlineStar,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";

export const getMainLinks = (cartCount = 0) => [
  {
    to: "/",
    label: "Home",
    icon: <AiOutlineHome className="text-xl" />,
  },
  {
    to: "/shop",
    label: "Shop",
    icon: <AiOutlineShopping className="text-xl" />,
  },
  {
    to: "/cart",
    label: "Cart",
    icon: <AiOutlineShoppingCart className="text-xl" />,
    badge: cartCount,
  },
  {
    to: "/favorites",
    label: "Wishlist",
    icon: <FaHeart className="text-lg text-rose-400" />,
  },
];

export const adminLinks = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: <AiOutlineDashboard className="text-lg" />,
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: <AiOutlineAppstore className="text-lg" />,
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: <AiOutlineTags className="text-lg" />,
  },
  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: <AiOutlineStar className="text-lg" />,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: <AiOutlineOrderedList className="text-lg" />,
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: <AiOutlineUser className="text-lg" />,
  },
];