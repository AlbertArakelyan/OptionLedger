import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import UsersPage from "./pages/UsersPage/UsersPage";
import OptionsPage from "./pages/OptionsPage/OptionsPage";
import OwnershipPage from "./pages/OwnershipPage/OwnershipPage";
import MatrixPage from "./pages/MatrixPage/MatrixPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import { Toast } from "./components/Toast/Toast";
import { AppProvider } from "./hooks";
import { Settings } from "lucide-react";
import "./styles/global.css";
import "./App.css";

type Page = "users" | "options" | "ownership" | "matrix" | "settings";

function AppContent() {
  const navItems: Array<{ id: Page; label: string; path: string }> = [
    { id: "users", label: "Users", path: "/users" },
    { id: "options", label: "Options", path: "/options" },
    { id: "ownership", label: "Ownership", path: "/ownership" },
    { id: "matrix", label: "Matrix", path: "/matrix" },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 OptionLedger</h1>
        <p className="subtitle">Shared Stock Option Management</p>
      </header>

      <nav className="app-nav">
        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-button nav-settings ${isActive ? "active" : ""}`}
          title="Settings"
        >
          <Settings size={20} />
        </NavLink>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/ownership" element={<OwnershipPage />} />
          <Route path="/matrix" element={<MatrixPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<UsersPage />} />
        </Routes>
      </main>

      <Toast />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
}

export default App;

