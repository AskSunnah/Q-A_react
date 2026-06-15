import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FilePlus,
  Files,
  BookPlus,
  Library,
  LogOut,
  MessageSquare,
  X,
  ArrowUpRight,
  MessageCircleHeart,
} from "lucide-react";

const MENU = [
  { label: "Dashboard", icon: Home, route: "/supervised/dashboard" },
  { label: "Add Q&A", icon: FilePlus, route: "/supervised/add-qa" },
  { label: "All Q&As", icon: Files, route: "/supervised/all-qa" },
  {
    label: "User Questions",
    icon: MessageSquare,
    route: "/supervised/user-questions",
  },
  { label: "Add Book", icon: BookPlus, route: "/supervised/add-book" },
  { label: "English Books", icon: Library, route: "/supervised/books/en" },
  { label: "Arabic Books", icon: Library, route: "/supervised/books/ar" },
  {
    label: "User Feedback",
    icon: MessageCircleHeart,
    route: "/supervised/user-feedback",
  },
];

export default function Sidebar({ navigate, mobileOpen, setMobileOpen }) {
  const { pathname } = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/supervised", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-[98]"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          w-[260px] bg-[#faf9f5] text-[#323232]
          flex flex-col h-full
          fixed top-0 z-[99]
          border-r border-[#dfd7d7]
          transition-[left] duration-300
          overflow-hidden
          ${mobileOpen ? "left-0" : isMobile ? "left-[-260px]" : "left-0"}
        `}
        style={{ paddingTop: "2px" }}
      >
        {/* Top: Logo + Close */}
        <div className="px-5 h-[60px] flex items-center justify-between border-b border-[#dfd7d7] shrink-0">
          <h1 className="text-[1.1rem] font-bold m-0 leading-none flex items-center text-[#323232]">
            Ask Sunnah
          </h1>

          <div className="flex items-center gap-2">
            <a
              href="https://asksunnah.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-md border border-[#dfd7d7] text-[#323232] hover:bg-[#f0ece0] transition-colors duration-200"
              title="Visit asksunnah.com"
            >
              <ArrowUpRight size={20} />
            </a>

            {isMobile && (
              <button
                onClick={() => setMobileOpen(false)}
                className="bg-transparent border-none cursor-pointer flex items-center justify-end h-full p-0"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto mt-[10px] pb-[80px]">
          {MENU.map(({ label, icon: Icon, route }) => {
            const isActive = pathname.includes(route);
            return (
              <NavLink
                key={label}
                to={route}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-[10px]
                  px-5 py-3 mx-[6px] rounded-lg
                  no-underline font-medium text-[0.92rem]
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#c3a421] text-white font-semibold"
                      : "bg-transparent text-[#323232] hover:bg-[#f0ece0]"
                  }
                `}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sticky Logout */}
        <div
          onClick={handleLogout}
          className="
            sticky bottom-0 px-5 py-[14px]
            font-medium cursor-pointer
            border-t border-[#dfd7d7]
            flex items-center gap-[10px]
            bg-[#faf9f5] z-[100]
            hover:bg-[#f0ece0] transition-colors duration-200
          "
        >
          <LogOut size={18} />
          Logout
        </div>
      </div>
    </>
  );
}
