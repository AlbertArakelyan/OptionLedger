import "./Table.module.css";

interface TableProps {
  headers: string[];
  rows: React.ReactNode[][];
  emptyMessage?: string;
  className?: string;
}

export function Table({
  headers,
  rows,
  emptyMessage = "No data available",
  className,
}: TableProps) {
  if (rows.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <table className={className || "data-table"}>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {row.map((cell, cellIdx) => (
              <td key={cellIdx}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
