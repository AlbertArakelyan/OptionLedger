import { useState } from "react";
import UsersPage from "./pages/UsersPage";
import OptionsPage from "./pages/OptionsPage";
import OwnershipPage from "./pages/OwnershipPage";
import MatrixPage from "./pages/MatrixPage";
import "./App.css";

type Page = "users" | "options" | "ownership" | "matrix";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("users");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>OptionLedger</h1>
      <nav style={{ marginBottom: "30px" }}>
        <button
          onClick={() => setCurrentPage("users")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontWeight: currentPage === "users" ? "bold" : "normal",
          }}
        >
          Users
        </button>
        <button
          onClick={() => setCurrentPage("options")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontWeight: currentPage === "options" ? "bold" : "normal",
          }}
        >
          Options
        </button>
        <button
          onClick={() => setCurrentPage("ownership")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontWeight: currentPage === "ownership" ? "bold" : "normal",
          }}
        >
          Ownership
        </button>
        <button
          onClick={() => setCurrentPage("matrix")}
          style={{
            padding: "10px 20px",
            fontWeight: currentPage === "matrix" ? "bold" : "normal",
          }}
        >
          Matrix
        </button>
      </nav>
      <main>
        {currentPage === "users" && <UsersPage />}
        {currentPage === "options" && <OptionsPage />}
        {currentPage === "ownership" && <OwnershipPage />}
        {currentPage === "matrix" && <MatrixPage />}
      </main>
    </div>
  );
}

export default App;

