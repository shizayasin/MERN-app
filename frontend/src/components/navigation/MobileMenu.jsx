import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AiOutlineProfile, AiOutlineLogout } from "react-icons/ai";
import UserAvatar from "../common/UserAvatar";

const MobileMenu = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  mainLinks,
  userInfo,
  adminLinks,
  logoutHandler,
}) => {
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  if (!mobileMenuOpen) return null;

  const handleLogout = () => {
    logoutHandler?.();
    setMobileMenuOpen(false);
  };

  const linkClass = (isActive = false) => `
    flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200
    ${isActive 
      ? "bg-emerald-50 text-emerald-700 font-semibold" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
    }
  `;

  return (
    <>
      {/* Background Dim Backdrop */}
      <div 
        className="md:hidden fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Side Sheet Panel Container */}
      <div className="md:hidden fixed top-16 right-0 w-4/5 max-w-sm h-[calc(100vh-64px)] bg-white z-50 p-5 overflow-y-auto border-l border-slate-100 shadow-2xl animate-in slide-in-from-right duration-200 flex flex-col justify-between">
        
        {/* Navigation Core */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-4 mb-2">
            Discover
          </p>
          {mainLinks.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={linkClass(isActive)}
              >
                <span className={isActive ? "text-emerald-600" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Account / Contextual Management Block */}
        {userInfo ? (
          <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
            {/* Identity badge Card */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/50 p-3 rounded-xl">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <UserAvatar userInfo={userInfo} className="h-10 w-10 rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-800 truncate">
                  {userInfo.username}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {userInfo.isAdmin ? "Administrator" : "Customer Account"}
                </span>
              </div>
            </div>

            {/* Account Specific Navigation */}
            <div className="space-y-1">
              <Link to="/profile" className={linkClass(location.pathname === "/profile")}>
                <AiOutlineProfile className="text-lg text-slate-400" />
                <span>Profile Settings</span>
              </Link>

              {userInfo?.isAdmin && (
                <>
                  <div className="my-2 border-t border-slate-100/80" />
                  <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase px-4 py-1.5">
                    Management Control
                  </p>
                  {adminLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={linkClass(location.pathname === link.to)}
                    >
                      <span className="text-slate-400">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              )}

              <div className="my-2 border-t border-slate-100/80" />
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold text-rose-600 hover:bg-rose-50/60 active:bg-rose-100/50 transition-all"
              >
                <AiOutlineLogout className="text-lg text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
            <Link 
              to="/login" 
              className="flex-1 text-center py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-700 active:bg-slate-50 transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="flex-1 text-center py-2.5 text-sm font-medium bg-emerald-600 rounded-xl text-white shadow-sm active:bg-emerald-700 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileMenu;