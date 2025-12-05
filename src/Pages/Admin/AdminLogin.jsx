// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminLogin } from "../../api/adminAuth";

// export default function AdminLogin() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!username || !password) {
//       setMessage("Please enter both fields");
//       return;
//     }
//     const result = await adminLogin(username, password);
//     if (result.success) {
//       localStorage.setItem("adminToken", result.token);
//       setMessage("Login successful! Redirecting...");
//       setTimeout(() => navigate("/supervised/dashboard"), 800);
//     } else {
//       setMessage(result.message || "Login failed");
//     }
//   };

//   return (
//     <div className="admin-login-root">
//       {/* INLINE STYLES */}
//       <style>{`
//         body, .admin-login-root {
//           background: #f7f8fa;
//           min-height: 100vh;
//         }
//         .login-card {
//           background: #fff;
//           max-width: 400px;
//           margin: 5rem auto 0 auto;
//           border-radius: 2rem;
//           box-shadow: 0 6px 32px 0 rgba(40,115,70,0.10), 0 1.5px 6px 0 rgba(40,115,70,0.10);
//           padding: 2.5rem 2.5rem 2rem 2.5rem;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }
//         .login-card h2 {
//           color: #c3a421;
//           font-size: 2.4rem;
//           font-weight: bold;
//           margin-bottom: 2rem;
//         }
//         .login-input {
//           width: 100%;
//           padding: 1rem;
//           border-radius: 10px;
//           border: 1px solid #ced4b5ff;
//           background: #f5f7f1ff;
//           margin-bottom: 1.5rem;
//           font-size: 1.1rem;
//           transition: border 0.2s;
//         }
//         .login-input:focus {
//           border: 1.5px solid #c3a421;
//           outline: none;
//           background: #e8f5ea;
//         }
//         .login-btn {
//           width: 70%;
//           padding: 0.8rem;
//           border-radius: 12px;
//           border: none;
//           background: #c3a421;
//           color: #fff;
//           font-size: 1.3rem;
//           font-weight: bold;
//           cursor: pointer;
//           margin-top: 0.5rem;
//           margin-bottom: 1rem;
//           box-shadow: 0 2px 6px rgba(40,115,70,0.10);
//           transition: background 0.2s;
//         }
//         .login-btn:hover {
//           background: #c3a421;
//         }
//         .login-msg {
//           height: 22px;
//           color: #d32f2f;
//           font-size: 1rem;
//           margin-top: 0.5rem;
//         }
//         @media (max-width: 500px) {
//           .login-card {
//             max-width: 95vw;
//             padding: 1.2rem 0.5rem 2rem 0.5rem;
//           }
//           .login-card h2 {
//             font-size: 2rem;
//           }
//         }
//       `}</style>

//       {/* LOGIN CARD */}
//       <div className="login-card">
//         <h2>Admin Login</h2>
//         <input
//           className="login-input"
//           type="text"
//           placeholder="Username"
//           value={username}
//           autoComplete="username"
//           onChange={e => setUsername(e.target.value)}
//         />
//         <input
//           className="login-input"
//           type="password"
//           placeholder="Password"
//           value={password}
//           autoComplete="current-password"
//           onChange={e => setPassword(e.target.value)}
//         />
//         <button className="login-btn" onClick={handleLogin}>
//           Login
//         </button>
//         <div className="login-msg" style={{ color: message.includes('success') ? "#287346" : "#d32f2f" }}>
//           {message}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminLogin } from "../../api/adminAuth";

// export default function AdminLogin() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!username || !password) {
//       setMessage("Please enter both fields");
//       return;
//     }
//     const result = await adminLogin(username, password);
//     if (result.success) {
//       localStorage.setItem("adminToken", result.token);
//       setMessage("Login successful! Redirecting...");
//       setTimeout(() => navigate("/supervised/dashboard"), 800);
//     } else {
//       setMessage(result.message || "Login failed");
//     }
//   };

//   const isSuccess = message.includes("success");

//   return (
//     <div className="admin-login-root">
//       <style>{`
//         body, .admin-login-root {
//           margin: 0;
//           padding: 0;
//           font-family: 'Segoe UI', 'Helvetica Neue', sans-serif;
//           background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .login-container {
//           width: 100%;
//           max-width: 420px;
//           padding: 2rem;
//         }

//         .login-card {
//           background: #ffffff;
//           border-radius: 16px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
//           padding: 3rem 2.5rem;
//           text-align: center;
//           border: 1px solid #e2e8f0;
//         }

//         .logo-placeholder {
//           width: 80px;
//           height: 80px;
//           background: #c3a421;
//           border-radius: 50%;
//           margin: 0 auto 1.5rem;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           font-size: 2rem;
//           font-weight: bold;
//         }

//         .login-card h2 {
//           margin: 0 0 0.5rem 0;
//           font-size: 1.8rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .login-card p.subtitle {
//           margin: 0 0 2rem 0;
//           color: #718096;
//           font-size: 0.95rem;
//         }

//         .input-group {
//           position: relative;
//           margin-bottom: 1.2rem;
//         }

//         .input-group label {
//           display: block;
//           text-align: left;
//           margin-bottom: 0.5rem;
//           color: #4a5568;
//           font-weight: 500;
//           font-size: 0.95rem;
//         }

//         .login-input {
//           width: 100%;
//           padding: 0.9rem 1rem;
//           border-radius: 10px;
//           border: 1.5px solid #e2e8f0;
//           background: #ffffff;
//           font-size: 1rem;
//           transition: all 0.2s ease;
//           box-sizing: border-box;
//         }

//         .login-input:focus {
//           outline: none;
//           border-color: #c3a421;
//           box-shadow: 0 0 0 3px rgba(195, 164, 33, 0.15);
//         }

//         .login-btn {
//           width: 100%;
//           padding: 0.9rem;
//           margin-top: 1rem;
//           border: none;
//           border-radius: 10px;
//           background: #c3a421;
//           color: white;
//           font-size: 1.1rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           box-shadow: 0 4px 12px rgba(195, 164, 33, 0.25);
//         }

//         .login-btn:hover {
//           background: #b0921d;
//           transform: translateY(-1px);
//           box-shadow: 0 6px 16px rgba(195, 164, 33, 0.3);
//         }

//         .login-btn:active {
//           transform: translateY(0);
//         }

//         .login-msg {
//           min-height: 24px;
//           margin-top: 1rem;
//           font-size: 0.95rem;
//           font-weight: 500;
//           padding: 0.5rem;
//           border-radius: 6px;
//           transition: all 0.3s ease;
//         }

//         @media (max-width: 480px) {
//           .login-container {
//             padding: 1rem;
//           }
//           .login-card {
//             padding: 2.5rem 1.8rem;
//           }
//         }
//       `}</style>

//       <div className="login-container">
//         <div className="login-card">
//           {/* Optional: Replace with your logo */}
//          <div className="logo-placeholder">
//   <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//     <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//   </svg>
// </div>

//           <h2>Admin Portal</h2>
//           <p className="subtitle">Sign in to access the administration dashboard</p>

//           <div className="input-group">
//             <label htmlFor="username">Username</label>
//             <input
//               id="username"
//               className="login-input"
//               type="text"
//               placeholder="Enter your username"
//               value={username}
//               autoComplete="username"
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div className="input-group">
//             <label htmlFor="password">Password</label>
//             <input
//               id="password"
//               className="login-input"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               autoComplete="current-password"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button className="login-btn" onClick={handleLogin}>
//             Sign In
//           </button>

//           <div
//             className="login-msg"
//             style={{
//               color: isSuccess ? "#2e7d32" : "#c62828",
//               backgroundColor: isSuccess ? "#e8f5e8" : "#ffebee",
//               opacity: message ? 1 : 0,
//             }}
//           >
//             {message}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminAuth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both fields");
      return;
    }
    const result = await adminLogin(username, password);
    if (result.success) {
      localStorage.setItem("adminToken", result.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/supervised/dashboard"), 800);
    } else {
      setMessage(result.message || "Login failed");
    }
  };

  const isSuccess = message.includes("success");

  return (
    <div className="admin-login-root">
      <style jsx>{`
        body, .admin-login-root {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #fdfdfd;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 88vw;
          max-width: 380px;
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem 1.8rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.09);
          border: 1px solid #eaeff5;
          text-align: center;
        }

        .logo {
          width: 62px;
          height: 62px;
          background: #c3a421;
          border-radius: 50%;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h2 {
          margin: 0 0 0.35rem;
          font-size: 1.55rem;
          font-weight: 600;
          color: #1a202c;
        }

        .subtitle {
          margin: 0 0 1.4rem;
          font-size: 0.89rem;
          color: #64748b;
        }

        label {
          display: block;
          text-align: left;
          margin-bottom: 0.4rem;
          font-size: 0.89rem;
          font-weight: 500;
          color: #374151;
        }

        input {
          width: 100%;
          padding: 0.78rem 0.95rem;
          margin-bottom: 0.9rem;
          border: 1.4px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          background: #fff;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #c3a421;
          box-shadow: 0 0 0 3.5px rgba(195,164,33,0.16);
        }

        button {
          width: 100%;
          padding: 0.85rem;
          margin-top: 0.5rem;
          background: #c3a421;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.02rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s;
          box-shadow: 0 4px 14px rgba(195,164,33,0.32);
        }

        button:hover {
          background: #b0931d;
          transform: translateY(-1.5px);
          box-shadow: 0 8px 20px rgba(195,164,33,0.38);
        }

        .msg {
          min-height: 22px;
          margin-top: 0.9rem;
          padding: 0.45rem 0.8rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 500;
          background: ${isSuccess ? "rgba(46,125,50,0.12)" : "rgba(211,47,47,0.12)"};
          color: ${isSuccess ? "#2e7d32" : "#c62828"};
          opacity: ${message ? 1 : 0};
          transition: all 0.3s;
        }

        @media (max-width: 480px) {
          .login-card {
            width: 88vw;
            padding: 1.9rem 1.6rem;
          }
        }
      `}</style>

      <div className="login-card">
        {/* Gold circle + white lock */}
        <div className="logo">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2>Admin Portal</h2>
        <p className="subtitle">Secure administration access</p>

        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Sign In</button>

        <div className="msg">{message}</div>
      </div>
    </div>
  );
}