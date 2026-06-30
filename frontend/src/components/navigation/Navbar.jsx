import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { AiOutlineMenu, AiOutlineClose, AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { MdMenuOpen } from "react-icons/md";
import UserAvatar from "../common/UserAvatar";

const Navbar = ({ mobileMenuOpen, setMobileMenuOpen, setSidebarCollapsed, cartItems = [], userInfo = null }) => {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-100/80 flex items-center transition-all duration-300">
      {/* =============== MOBILE LAYOUT (< 768px) =============== */}
      <div className="md:hidden w-full flex items-center justify-between px-4 h-full">
        {/* Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </button>

        {/* Center Branding */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={Logo} alt="StyleHub" className="h-8 w-8 object-contain" />
          <div className="flex flex-col">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none">
              StyleHub
            </h2>
            <span className="text-[8px] tracking-[0.15em] font-bold text-emerald-600 mt-0.5">
              FASHION
            </span>
          </div>
        </Link>

        {/* Cart Badge (Mobile) */}
        <div className="relative">
          <button className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all">
            <AiOutlineShoppingCart size={20} />
          </button>
          {cartItems?.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartItems.reduce((sum, item) => sum + Number(item?.qty || 0), 0)}
            </span>
          )}
        </div>
      </div>

      {/* =============== DESKTOP LAYOUT (≥ 768px) =============== */}
      <div className="hidden md:flex w-full items-center justify-between px-6 h-full gap-6">
        {/* Left: Sidebar Toggle + Branding */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setSidebarCollapsed?.((prev) => !prev)}
            className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all active:scale-95"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <MdMenuOpen size={20} />
          </button>

          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src={Logo} alt="StyleHub" className="h-8 w-8 object-contain" />
            <div className="hidden lg:flex flex-col">
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none">
                STYLE HUB
              </h2>
              <span className="text-[9px] tracking-[0.14em] font-bold text-emerald-600 mt-0.5">
                Fashion For You
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Cart & User Menu */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all"
            title="Shopping Cart"
          >
            <AiOutlineShoppingCart size={20} />
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {cartItems.reduce((sum, item) => sum + Number(item?.qty || 0), 0)}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <Link
            to={userInfo ? "/profile" : "/login"}
            className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all"
            title={userInfo ? "Profile" : "Login"}
          >
            {userInfo ? (
              <div className="h-full w-full overflow-hidden rounded-xl">
                <UserAvatar userInfo={userInfo} className="h-full w-full rounded-xl" />
              </div>
            ) : (
              <AiOutlineUser size={20} />
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
