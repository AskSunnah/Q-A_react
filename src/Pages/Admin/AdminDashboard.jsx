
import AdminHeader from "../../Components/Admin/Header"; // adjust path as needed
import { useNavigate } from "react-router-dom";

const ADMIN_TABS = [
  { label: "Add Q&A", route: "/supervised/add-qa" },
  { label: "All Q&As", route: "/supervised/all-qa" },
  { label: "Add a book", route: "/supervised/add-book" },
  { label: "All Books", route: "/supervised/manage-books" }
];

export default function AdminDashboard() {
  
  const navigate = useNavigate();

  if (!localStorage.getItem("adminToken")) {
    navigate("/supervised", { replace: true });
    return null;
  }

  const handleNav = (route) => {
    navigate(route);
  };

  return (
    <div className="admin-dashboard-root">
      <style>{`
        .admin-dashboard-root {
          background-color: #f7f8fa;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .nav {
          background: #f0f3f2;
          padding: 12px 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .nav a, .nav .dashboard-link {
          text-decoration: none;
          color: #287346;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 1rem;
        }
        .nav a:hover, .nav .dashboard-link:hover {
          text-decoration: underline;
        }
        .content {
          flex: 1;
          padding: 20px;
        }
        @media (max-width: 600px) {
          .nav {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>

      <AdminHeader />
      <nav className="nav">
        {ADMIN_TABS.map(tab => (
          <span
            key={tab.route}
            className="dashboard-link"
            onClick={() => handleNav(tab.route)}
          >
            {tab.label}
          </span>
        ))}
      </nav>

      <div className="content">
        <p>Welcome to the Ask Sunnah Admin Dashboard. Select a tab to get started.</p>
    </div>
    </div>
  );
}
