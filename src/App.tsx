import { useState } from "react";
import UsersPage from "./pages/UsersPage";
import OptionsPage from "./pages/OptionsPage";
import OwnershipPage from "./pages/OwnershipPage";
import MatrixPage from "./pages/MatrixPage";
import { Toast } from "./components";
import { AppProvider } from "./hooks";
import "./styles/global.css";
import "./App.css";

type Page = "users" | "options" | "ownership" | "matrix";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("users");

  const navItems: Array<{ id: Page; label: string }> = [
    { id: "users", label: "Users" },
    { id: "options", label: "Options" },
    { id: "ownership", label: "Ownership" },
    { id: "matrix", label: "Matrix" },
  ];

  return (
    <AppProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>📊 OptionLedger</h1>
          <p className="subtitle">Shared Stock Option Management</p>
        </header>

        <nav className="app-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`nav-button ${currentPage === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main className="app-main">
          {currentPage === "users" && <UsersPage />}
          {currentPage === "options" && <OptionsPage />}
          {currentPage === "ownership" && <OwnershipPage />}
          {currentPage === "matrix" && <MatrixPage />}
        </main>
      </div>

      <Toast />
    </AppProvider>
  );
}

export default App;

