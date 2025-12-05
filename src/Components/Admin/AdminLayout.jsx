

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";  // no curly braces


// export default function AdminLayout({ children }) {
// const navigate = useNavigate();

// return (
// <div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}> <Sidebar navigate={navigate} />

//   <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//     <header style={{
//       background: "#c3a421",
//       color: "white",
//       padding: "16px 24px",
//       fontSize: "1.2rem",
//       fontWeight: 600
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


import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
const navigate = useNavigate();

return (
<div style={{ display: "flex", minHeight: "100vh", background: "#f7f8fa" }}> <Sidebar navigate={navigate} />

  <div style={{ 
    flex: 1, 
    display: "flex", 
    flexDirection: "column",
    marginLeft: "260px" // offset content so it doesn't go under fixed sidebar
  }}>
    <header style={{
      background: "#faf9f5",
      color: "black",
      padding: "16px 24px",
      fontSize: "1.2rem",
      fontWeight: 600,
      borderBottom: "1px solid #dfd7d7ff", // 1px border below header
      paddingTop: "20px"
    }}>
      Ask Sunnah Admin Panel
    </header>

    <main style={{ padding: "28px", maxWidth: "1100px" }}>
      {children}
    </main>
  </div>
</div>


);
}
