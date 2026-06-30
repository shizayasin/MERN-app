import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Message from "../ui/Message";

import Sidebar from "../navigation/Sidebar";
import Navbar from "../navigation/Navbar";
import MobileMenu from "../navigation/MobileMenu";
import Footer from "./Footer";

import { useLogoutMutation } from "../../redux/api/userApiSlice";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
import { clearCartLocal } from "../../redux/features/cart/cartSlice";
import { clearFavoritesLocal } from "../../redux/features/favorites/favoritesSlice";
import { clearNotice } from "../../redux/features/ui/noticeSlice";
import { getMainLinks, adminLinks } from "../navigation/navLinks";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
  const { message, type } = useSelector((state) => state.notice || {});

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [logout] = useLogoutMutation();
  const mainLinks = getMainLinks(cartItems.length);
  const visibleAdminLinks = userInfo?.isAdmin ? adminLinks : [];
  const showNoticeBanner = (() => {
    const publicPrefixes = ["/product/", "/order/"];
    const publicPaths = ["/", "/shop", "/cart", "/favorites", "/login", "/register", "/profile", "/shipping", "/payment", "/placeorder", "/order-history", "/support", "/privacy", "/terms"];

    return publicPaths.includes(location.pathname) || publicPrefixes.some((prefix) => location.pathname.startsWith(prefix));
  })();

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      dispatch(clearNotice());
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message, dispatch]);

  useEffect(() => {
    if (message) {
      dispatch(clearNotice());
    }
  }, [dispatch, location.pathname, message]);

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Logout failed processing");
    } finally {
      dispatch(clearCartLocal());
      dispatch(clearFavoritesLocal());
      dispatch(logoutAction());
      navigate("/login");
      toast.success("Signed out securely");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Structural Desktop Sidebar Control Frame */}
      <Sidebar
        userInfo={userInfo}
        mainLinks={mainLinks}
        adminLinks={visibleAdminLinks}
        openUserMenu={openUserMenu}
        setOpenUserMenu={setOpenUserMenu}
        logoutHandler={logoutHandler}
        collapsed={sidebarCollapsed}
      />

      {/* Global Responsive Top Navbar (Desktop + Mobile) */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        cartItems={cartItems}
        userInfo={userInfo}
      />

      {/* Slide Out Mobile Drawer Portal Backdrop Context */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        mainLinks={mainLinks}
        userInfo={userInfo}
        adminLinks={visibleAdminLinks}
        logoutHandler={logoutHandler}
      />

      {/* ===================== VIEWPORT CONFIGURATION ===================== */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen pt-16 md:pt-16 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "md:ml-[88px]" : "md:ml-72"}`}>
        {message && showNoticeBanner ? (
          <div className="mx-4 mt-4 md:mx-6 lg:mx-8">
            <Message type={type}>{message}</Message>
          </div>
        ) : null}
        
        {/* Main Content Area */}
        <main className="flex-1 w-full animate-in fade-in duration-200">
          {children}
        </main>

        {/* Global Structural Footer */}
        <Footer />
      </div>
    </div>
  );
}