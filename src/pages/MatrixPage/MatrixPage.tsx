import { useState, useEffect } from "react";
import { MatrixView, getMatrixView } from "../../api";
import { LoadingSpinner, toast } from "../../components";
import styles from "./MatrixPage.module.css";

export default function MatrixPage() {
  const [matrix, setMatrix] = useState<MatrixView | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadMatrix = async () => {
    try {
      const data = await getMatrixView();
      setMatrix(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      toast.error("Failed to load matrix view");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatrix();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading matrix..." />;
  }

  if (!matrix) {
    return <div className={styles.emptyState}>No data available</div>;
  }

  const calculateTotals = (index: number) => {
    return matrix.rows.reduce((sum, row) => sum + (row.quantities[index] || 0), 0);
  };

  const calculateRowTotal = (quantities: number[]) => {
    return quantities.reduce((sum, qty) => sum + qty, 0);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.matrixHeader}>
        <h2>Ownership Matrix</h2>
        <div className={styles.matrixControls}>
          <button onClick={loadMatrix}>Refresh</button>
          <span className={styles.lastUpdated}>Last updated: {lastUpdated}</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.matrixTable}>
          <thead>
            <tr>
              <th>Option</th>
              {matrix.users.map((user) => (
                <th key={user.id} className={styles.userColumn}>
                  {user.name}
                </th>
              ))}
              <th className={styles.totalColumn}>Total</th>
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.option.id}>
                <td className={styles.optionCell}>
                  <div className={styles.optionName}>
                    {row.option.symbol} ${row.option.strike.toFixed(2)}
                  </div>
                  <div className={styles.optionDetail}>
                    {row.option.option_type.toUpperCase()} | {row.option.expiration}
                  </div>
                </td>
                {row.quantities.map((qty, idx) => (
                  <td key={idx} className={styles.qtyCell}>
                    {qty > 0 ? qty : "-"}
                  </td>
                ))}
                <td className={styles.totalCell}>{calculateRowTotal(row.quantities)}</td>
              </tr>
            ))}
            <tr className={styles.totalsRow}>
              <td className={styles.optionCell}>
                <strong>Total by User</strong>
              </td>
              {matrix.users.map((_, idx) => (
                <td key={idx} className={styles.totalCell}>
                  <strong>{calculateTotals(idx)}</strong>
                </td>
              ))}
              <td className={styles.totalCell}>
                <strong>{matrix.rows.reduce((sum, row) => sum + calculateRowTotal(row.quantities), 0)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
