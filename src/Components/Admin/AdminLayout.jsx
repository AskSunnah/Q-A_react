// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";

// export default function AdminLayout({ children }) {
// const navigate = useNavigate();

// return (
// <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}> <Sidebar navigate={navigate} />

//   <div style={{ 
//     flex: 1, 
//     display: "flex", 
//     flexDirection: "column",
//     marginLeft: "260px" // offset content so it doesn't go under fixed sidebar
//   }}>
//     <header style={{
//       background: "#faf9f5",
//       color: "black",
//       padding: "16px 24px",
//       fontSize: "1.2rem",
//       fontWeight: 600,
//       borderBottom: "1px solid #dfd7d7ff", // 1px border below header
//       paddingTop: "20px"
//     }}>
//       Ask Sunnah Admin Panel
//     </header>

//     <main style={{ padding: "28px", maxWidth: "1100px" }}>
//       {children}
//     </main>
//   </div>
// </div>


// );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import { Menu } from "lucide-react";

// export default function AdminLayout({ children }) {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
      
//       {/* SIDEBAR */}
//       <Sidebar navigate={navigate} mobileOpen={open} setMobileOpen={setOpen} />

//       {/* MAIN WRAPPER */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           marginLeft: window.innerWidth > 900 ? "260px" : "0",
//           transition: "0.3s",
//         }}
//       >
//         {/* HEADER */}
//       <header
//   style={{
//     background: "#faf9f5",
//     color: "black",
//     padding: "14px 20px",
//     fontSize: "1.1rem",
//     fontWeight: 600,
//     borderBottom: "1px solid #dfd7d7ff",
//     display: "flex",
//     alignItems: "center",
//     position: "relative",
//   }}
// >
//   {/* Left area (mobile menu) */}
//   <div style={{ width: "33%", display: "flex", alignItems: "center" }}>
//     <button
//       onClick={() => setOpen(true)}
//       style={{
//         display: window.innerWidth <= 900 ? "block" : "none",
//         background: "none",
//         border: "none",
//         cursor: "pointer",
//       }}
//     >
//       <Menu size={28} color="#323232" />
//     </button>
//   </div>

//   {/* Center title */}
//   <div
//     style={{
//       width: "33%",
//       display: "flex",
//       justifyContent: "center",
//       fontWeight: "700",
//     }}
//   >
//     Ask Sunnah Admin Panel
//   </div>

//   {/* Right empty area (balances layout) */}
//   <div style={{ width: "33%" }}></div>
// </header>

//         {/* MAIN CONTENT */}
//         <main style={{ padding: "20px", maxWidth: "1100px" }}>{children}</main>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}>
      
      {/* SIDEBAR */}
      <Sidebar navigate={navigate} mobileOpen={open} setMobileOpen={setOpen} />

      {/* MAIN WRAPPER */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isMobile ? "0" : "260px",
          transition: "0.3s",
        }}
      >

        {/* HEADER */}
        {/* <header
          style={{
            background: "#faf9f5",
            color: "black",
            padding: "18px 20px",
            borderBottom: "1px solid #dfd7d7ff",
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
   
          <div
            style={{
              width: isMobile ? "33%" : "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isMobile && (
              <button
                onClick={() => setOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Menu size={28} color="#323232" />
              </button>
            )}

            {!isMobile && (
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "20px", // smaller font for desktop
                  whiteSpace: "nowrap",
                }}
              >
                Ask Sunnah Admin Panel
              </span>
            )}
          </div>

          {isMobile && (
            <div
              style={{
                width: "33%",
                display: "flex",
                justifyContent: "center",
                fontWeight: 700,
                whiteSpace: "nowrap",
                fontSize: "18px", // smaller for mobile
              }}
            >
              Ask Sunnah Admin Panel
            </div>
          )}

          <div style={{ width: "33%" }}></div>
        </header> */}

<header
  style={{
    background: "#faf9f5",
    color: "black",
    padding: "0 20px",        // remove vertical padding
    height: "60px",           // fix header height
    borderBottom: "1px solid #dfd7d7ff",
    display: "flex",
    alignItems: "center",
    position: "relative",
  }}
>
  {/* Left area */}
  <div
    style={{
      width: isMobile ? "33%" : "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >
    {isMobile && (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 0,
          marginRight: "90px",
        }}
      >
        <Menu size={28} color="#323232" />
      </button>
    )}
  </div>

  {/* Centered title */}
  {isMobile && (
    <div
      style={{
        width: "33%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center", // important
        fontWeight: 700,
        whiteSpace: "nowrap",
        fontSize: "18px",
        height: "100%",        // align with header
      }}
    >
      Ask Sunnah Admin Panel
    </div>
  )}

  {/* Right area */}
  <div style={{ width: "33%" }}></div>
</header>

        {/* MAIN CONTENT */}
        <main style={{ padding: "20px", maxWidth: "1100px" }}>{children}</main>
      </div>
    </div>
  );
}
