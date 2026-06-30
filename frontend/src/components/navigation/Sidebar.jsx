import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Logo from "../../assets/Logo.png";
import {
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlineProfile,
} from "react-icons/ai";
import UserAvatar from "../common/UserAvatar";

const Sidebar = ({
  userInfo,
  mainLinks,
  adminLinks,
  openUserMenu,
  setOpenUserMenu,
  logoutHandler,
  collapsed = false,
}) => {
  const location = useLocation();

  useEffect(() => {
    setOpenUserMenu(false);
  }, [location.pathname, setOpenUserMenu]);

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 z-50 h-screen flex-col justify-between bg-white border-r border-slate-100/80 shadow-[1px_0_10px_rgba(0,0,0,0,01)] transition-all duration-300 ease-in-out ${
        collapsed ? "w-[88px]" : "w-72"
      }`}
    >
      {/* ===================== BRAND HEADER ===================== */}
      <div>
        <div className="h-20 border-b border-slate-100/80 flex items-center px-5">
          <Link to="/" className="flex items-center gap-3 transition-all duration-300 mx-auto">
            <img
              src={Logo}
              alt="Style Hub"
              className={`transition-transform duration-300 hover:rotate-6 ${
                collapsed ? "w-9 h-9" : "w-10 h-10"
              } object-contain`}
            />

            {!collapsed && (
              <div className="flex flex-col transition-opacity duration-200">
                <h2 className="text-[15px] font-extrabold text-slate-800 tracking-wide font-sans leading-none">
                  STYLE HUB
                </h2>
                <span className="text-[9px] tracking-[0.14em] uppercase text-emerald-600 font-bold mt-1">
                  Fashion For You
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* ===================== PRIMARY LINKS ===================== */}
        <div className="mt-6 px-3.5 space-y-1">
          {mainLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              title={item.label}
              onClick={() => setOpenUserMenu(false)}
              className={({ isActive }) => `
                relative flex items-center rounded-xl py-3 transition-all duration-200 group
                ${collapsed ? "justify-center px-0" : "gap-3.5 px-4"}
                ${isActive
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-emerald-500" />
                  )}

                  <span className={`text-xl flex items-center justify-center transition-transform duration-200 ${!isActive && "group-hover:scale-105 text-slate-400 group-hover:text-slate-600"}`}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="text-[13.5px] tracking-wide">
                      {item.label}
                    </span>
                  )}

                  {item.badge > 0 && (
                    <span className={`
                      rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center
                      ${collapsed 
                        ? "absolute top-1.5 right-3 h-4 min-w-[16px] px-1" 
                        : "ml-auto h-5 min-w-[20px] px-1.5"
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* ===================== CONTROL HUB & PROFILE ===================== */}
      <div className="border-t border-slate-100 p-3.5 bg-slate-50/40">
        {userInfo ? (
          <div className="relative">
            {/* Interactive Profile Slate */}
            <button
              onClick={() => setOpenUserMenu((prev) => !prev)}
              title="Profile settings"
              className={`w-full rounded-xl border border-slate-200/50 bg-white p-2.5 shadow-xs transition-all duration-200 hover:shadow-sm flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <div className="h-9 w-9 min-w-[36px] overflow-hidden rounded-xl">
                <UserAvatar userInfo={userInfo} className="h-9 w-9 rounded-xl" />
              </div>

              {!collapsed && (
                <>
                  <div className="flex flex-1 flex-col items-start truncate">
                    <span className="font-semibold text-[13px] text-slate-700 truncate w-full text-left leading-tight">
                      {userInfo.username}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {userInfo.isAdmin ? "Administrator" : "Customer"}
                    </span>
                  </div>
                  <span className={`text-slate-400 font-light transition-transform duration-200 ${openUserMenu ? "rotate-90 text-emerald-500" : ""}`}>
                    ›
                  </span>
                </>
              )}
            </button>

            {/* Dropup Interface */}
            {openUserMenu && !collapsed && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-slate-200/60 bg-white p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <Link
                  to="/profile"
                  onClick={() => setOpenUserMenu(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <AiOutlineProfile className="text-base text-slate-400" />
                  <span>Profile Settings</span>
                </Link>

                {userInfo.isAdmin && adminLinks.length > 0 && (
                  <>
                    <div className="my-1 border-t border-slate-100" />
                    <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase px-3 py-1">Admin Operations</p>
                    {adminLinks.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        onClick={() => setOpenUserMenu(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <span className="text-slate-400">{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </>
                )}

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setOpenUserMenu(false);
                    logoutHandler();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <AiOutlineLogout className="text-base" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Guest Access Layout Configuration */
          <div className="space-y-1">
            <NavLink
              to="/login"
              title="Login"
              className={`flex items-center rounded-xl py-2.5 text-slate-500 font-medium text-[13px] transition hover:bg-white border border-transparent hover:border-slate-200/50 hover:text-slate-800 ${
                collapsed ? "justify-center px-0" : "gap-3 px-4"
              }`}
            >
              <AiOutlineLogin className="text-lg text-slate-400" />
              {!collapsed && <span>Login</span>}
            </NavLink>

            <NavLink
              to="/register"
              title="Register"
              className={`flex items-center rounded-xl py-2.5 text-slate-500 font-medium text-[13px] transition hover:bg-white border border-transparent hover:border-slate-200/50 hover:text-slate-800 ${
                collapsed ? "justify-center px-0" : "gap-3 px-4"
              }`}
            >
              <AiOutlineUserAdd className="text-lg text-slate-400" />
              {!collapsed && <span>Register</span>}
            </NavLink>
          </div>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
