// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { Home, FilePlus,Files, BookPlus, Library,LogOut,MessageSquare } from "lucide-react";

// const MENU = [
//   { label: "Dashboard",         icon: Home,          route: "/supervised/dashboard" },
//   { label: "Add Q&A",           icon: FilePlus,      route: "/supervised/add-qa" },
//   { label: "All Q&As",          icon: Files,         route: "/supervised/all-qa" },
//   { label: "User Questions",    icon: MessageSquare, route: "/supervised/user-questions" },
//   { label: "Add Book",          icon: BookPlus,      route: "/supervised/add-book" },
//   { label: "All Books",         icon: Library,       route: "/supervised/all-books" }
// ];
// export default function AskSunnahSidebar({ navigate, setHeaderBg }) {
//     const { pathname } = useLocation();

//     const handleLogout = () => {
//         localStorage.removeItem("adminToken");
//         navigate("/supervised", { replace: true });
//     };

//     return (
//         <div style={{
//             width: "260px",
//             background: "#faf9f5",
//             color: "#323232",
//             display: "flex",
//             flexDirection: "column",
//             height: "100vh",
//             position: "fixed",
//             top: 0,
//             left: 0,
//             paddingTop: "2px",
//             borderRight: "1px solid #dfd7d7ff",
//         }}>
//             {/* Logo */}
//             <div style={{
//                 padding: "0 20px",
//                 height: "60px",
//                 display: "flex",
//                 alignItems: "center",
//                 borderBottom: "1px solid #dfd7d7ff"
//             }}>
//                 <h1 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#323232" }}>
//                     Ask Sunnah </h1> </div>

//             {/* Menu Items */}
//             <nav style={{ flex: 1, marginTop: "10px" }}>
//                 {MENU.map(({ label, icon: Icon, route }) => {
//                     const isActive = pathname.includes(route);
//                     if (isActive && setHeaderBg) setHeaderBg(true);
//                     return (
//                         <NavLink
//                             key={label}
//                             to={route}
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: "10px",
//                                 padding: isActive ? "14px 20px" : "10px 20px",
//                                 textDecoration: "none",
//                                 fontWeight: isActive ? "600" : "500",
//                                 fontSize: isActive ? "1rem" : "0.9rem",
//                                 background: isActive ? "#c3a421" : "transparent",
//                                 color: isActive ? "white" : "#323232",
//                                 borderRadius: isActive ? "8px" : "4px",
//                                 margin:"8px",
//                                 // marginBottom: "6px",
//                                 transition: "0.2s"
//                             }}

//                         >
//                             <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
//                             <span>{label}</span>
//                         </NavLink>
//                     );
//                 })}
//             </nav>

//             {/* Logout */}
//             <div
//                 onClick={handleLogout}
//                 style={{
//                     padding: "12px 20px",
//                     fontWeight: 500,
//                     textAlign: "center",
//                     cursor: "pointer",
//                     marginTop: "auto",
//                     borderTop: "1px solid #dfd7d7ff",  // border top
//                     borderRadius: "4px",
//                     color: "#323232",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "10px",
//                     transition: "0.2s"
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.background = "#e5e2d3"}
//                 onMouseLeave={e => e.currentTarget.style.background = "transparent"}
//             >
//                 <LogOut size={18} style={{ verticalAlign: "middle" }} />
//                 Logout
//             </div>
//         </div>


//     );
// }


import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  FilePlus,
  Files,
  BookPlus,
  Library,
  LogOut,
  MessageSquare,
  X
} from "lucide-react";

const MENU = [
  { label: "Dashboard", icon: Home, route: "/supervised/dashboard" },
  { label: "Add Q&A", icon: FilePlus, route: "/supervised/add-qa" },
  { label: "All Q&As", icon: Files, route: "/supervised/all-qa" },
  { label: "User Questions", icon: MessageSquare, route: "/supervised/user-questions" },
  { label: "Add Book", icon: BookPlus, route: "/supervised/add-book" },
  { label: "All Books", icon: Library, route: "/supervised/all-books" },
];

export default function Sidebar({ navigate, mobileOpen, setMobileOpen }) {
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/supervised", { replace: true });
  };

  return (
    <>
      {/* OVERLAY FOR MOBILE */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 98,
          }}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",
          background: "#faf9f5",
          color: "#323232",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: mobileOpen ? "0" : window.innerWidth <= 900 ? "-260px" : "0",
          paddingTop: "2px",
          borderRight: "1px solid #dfd7d7ff",
          zIndex: 99,
          transition: "left 0.3s",
        }}
      >
        {/* Top Row */}
        <div
          style={{
            padding: "0 20px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #dfd7d7ff",
          }}
        >
          <h1 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Ask Sunnah</h1>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              display: window.innerWidth <= 900 ? "block" : "none",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, marginTop: "10px" }}>
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

        {/* Logout */}
        <div
          onClick={handleLogout}
          style={{
            padding: "14px 20px",
            fontWeight: 500,
            cursor: "pointer",
            borderTop: "1px solid #dfd7d7ff",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <LogOut size={18} />
          Logout
        </div>
      </div>
    </>
  );
}
