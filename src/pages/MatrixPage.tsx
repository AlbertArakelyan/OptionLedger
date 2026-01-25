import { useState, useEffect } from "react";
import { MatrixView, getMatrixView } from "../api";

export default function MatrixPage() {
  const [matrix, setMatrix] = useState<MatrixView | null>(null);
  const [error, setError] = useState("");

  const loadMatrix = async () => {
    try {
      const data = await getMatrixView();
      setMatrix(data);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    loadMatrix();
    const interval = setInterval(loadMatrix, 5000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!matrix) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Matrix View</h2>
      <button onClick={loadMatrix} style={{ marginBottom: "20px" }}>
        Refresh
      </button>
      <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Option</th>
            {matrix.users.map((user) => (
              <th key={user.id}>{user.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.option.id}>
              <td>
                {row.option.symbol} ${row.option.strike} {row.option.option_type}{" "}
                {row.option.expiration}
              </td>
              {row.quantities.map((qty, idx) => (
                <td key={idx} style={{ textAlign: "right" }}>
                  {qty}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
