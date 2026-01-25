import { useState, useEffect } from "react";
import { Option, createOption, listOptions, deleteOption } from "../api";

export default function OptionsPage() {
  const [options, setOptions] = useState<Option[]>([]);
  const [symbol, setSymbol] = useState("");
  const [optionType, setOptionType] = useState<"call" | "put">("call");
  const [strike, setStrike] = useState("");
  const [expiration, setExpiration] = useState("");
  const [error, setError] = useState("");

  const loadOptions = async () => {
    try {
      const data = await listOptions();
      setOptions(data);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !strike || !expiration) return;
    try {
      await createOption(symbol.trim(), optionType, parseFloat(strike), expiration);
      setSymbol("");
      setStrike("");
      setExpiration("");
      await loadOptions();
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this option?")) return;
    try {
      await deleteOption(id);
      await loadOptions();
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div>
      <h2>Options Manager</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol (e.g. AAPL)"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <select
          value={optionType}
          onChange={(e) => setOptionType(e.target.value as "call" | "put")}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
        <input
          type="number"
          step="0.01"
          value={strike}
          onChange={(e) => setStrike(e.target.value)}
          placeholder="Strike"
          style={{ marginRight: "10px", padding: "5px", width: "100px" }}
        />
        <input
          type="date"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button type="submit">Add Option</button>
      </form>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Strike</th>
            <th>Expiration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.id}>
              <td>{option.id}</td>
              <td>{option.symbol}</td>
              <td>{option.option_type}</td>
              <td>{option.strike}</td>
              <td>{option.expiration}</td>
              <td>
                <button onClick={() => handleDelete(option.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
