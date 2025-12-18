import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, FilePlus, Files, BookPlus, Library, LogOut, MessageSquare, X,MessageCircleHeart } from "lucide-react";

const MENU = [
{ label: "Dashboard", icon: Home, route: "/supervised/dashboard" },
{ label: "Add Q&A", icon: FilePlus, route: "/supervised/add-qa" },
{ label: "All Q&As", icon: Files, route: "/supervised/all-qa" },
{ label: "User Questions", icon: MessageSquare, route: "/supervised/user-questions" },
{ label: "Add Book", icon: BookPlus, route: "/supervised/add-book" },
{ label: "All Books", icon: Library, route: "/supervised/all-books" },
{ label: "User Feedback", icon: MessageCircleHeart, route: "/supervised/user-feedback" },
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
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    zIndex: 98,
                }}
            />
        )}

        {/* SIDEBAR */}
        <div
            style={{
                width: "260px",
                background: "#faf9f5",
                color: "#323232",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                position: "fixed",
                top: 0,
                left: mobileOpen ? "0" : isMobile ? "-260px" : "0",
                paddingTop: "2px",
                borderRight: "1px solid #dfd7d7ff",
                zIndex: 99,
                transition: "left 0.3s",
                overflow: "hidden", // hide overflow on container
            }}
        >
            {/* Top: Logo + Close */}
            <div
                style={{
                    padding: "0 20px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #dfd7d7ff",
                    flexShrink: 0,
                }}
            >
                <h1
                    className="admin-sidebar-header"
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        margin: 0,
                        lineHeight: "1",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    Ask Sunnah
                </h1>

                {isMobile && (
                    <button
                        className="admin-sidebar-cross"
                        onClick={() => setMobileOpen(false)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            height: "100%",
                            padding: 0,
                        }}
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Menu */}
            <nav
                style={{
                    flex: 1,
                    overflowY: "auto", // makes menu scrollable
                    marginTop: "10px",
                    paddingBottom: "80px", // space for sticky logout
                }}
            >
                {MENU.map(({ label, icon: Icon, route }) => {
                    const isActive = pathname.includes(route);
                    return (
                        <NavLink
                            key={label}
                            to={route}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "12px 20px",
                                textDecoration: "none",
                                fontWeight: isActive ? "600" : "500",
                                fontSize: "0.92rem",
                                background: isActive ? "#c3a421" : "transparent",
                                color: isActive ? "white" : "#323232",
                                margin: "6px",
                                borderRadius: "8px",
                                transition: "0.2s",
                            }}
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
                style={{
                    position: "sticky",
                    bottom: 0,
                    padding: "14px 20px",
                    fontWeight: 500,
                    cursor: "pointer",
                    borderTop: "1px solid #dfd7d7ff",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "#faf9f5",
                    zIndex: 100,
                }}
            >
                <LogOut size={18} />
                Logout
            </div>
        </div>
    </>
);


}
