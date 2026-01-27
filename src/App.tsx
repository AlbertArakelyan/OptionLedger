import { useState } from "react";
import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import OptionsPage from "./pages/OptionsPage";
import OwnershipPage from "./pages/OwnershipPage";
import MatrixPage from "./pages/MatrixPage";
import { Toast } from "./components";
import { AppProvider } from "./hooks";
import "./styles/global.css";
import "./App.css";

type Page = "users" | "options" | "ownership" | "matrix";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("users");
  const navigate = useNavigate();

  const navItems: Array<{ id: Page; label: string; path: string }> = [
    { id: "users", label: "Users", path: "/users" },
    { id: "options", label: "Options", path: "/options" },
    { id: "ownership", label: "Ownership", path: "/ownership" },
    { id: "matrix", label: "Matrix", path: "/matrix" },
  ];

  const handleNavClick = (id: Page, path: string) => {
    setCurrentPage(id);
    navigate(path);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📊 OptionLedger</h1>
        <p className="subtitle">Shared Stock Option Management</p>
      </header>

      <nav className="app-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id, item.path)}
            className={`nav-button ${currentPage === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/options" element={<OptionsPage />} />
          <Route path="/ownership" element={<OwnershipPage />} />
          <Route path="/matrix" element={<MatrixPage />} />
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

