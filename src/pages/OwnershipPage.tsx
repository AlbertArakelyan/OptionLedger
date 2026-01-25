import { useState, useEffect } from "react";
import { User, Option, listUsers, listOptions, setOwnership, getOwnerships, OptionOwnership } from "../api";

export default function OwnershipPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [ownerships, setOwnerships] = useState<OptionOwnership[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [usersData, optionsData, ownershipsData] = await Promise.all([
        listUsers(),
        listOptions(),
        getOwnerships(),
      ]);
      setUsers(usersData);
      setOptions(optionsData);
      setOwnerships(ownershipsData);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOption !== null) {
      const newQuantities: Record<number, string> = {};
      users.forEach((user) => {
        const ownership = ownerships.find(
          (o) => o.user_id === user.id && o.option_id === selectedOption
        );
        newQuantities[user.id] = ownership ? String(ownership.quantity) : "0";
      });
      setQuantities(newQuantities);
    }
  }, [selectedOption, users, ownerships]);

  const handleSave = async (userId: number) => {
    if (selectedOption === null) return;
    const quantity = parseInt(quantities[userId] || "0", 10);
    try {
      await setOwnership(userId, selectedOption, quantity);
      await loadData();
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div>
      <h2>Ownership Editor</h2>
      <div style={{ marginBottom: "20px" }}>
        <label>Select Option: </label>
        <select
          value={selectedOption ?? ""}
          onChange={(e) => setSelectedOption(e.target.value ? Number(e.target.value) : null)}
          style={{ padding: "5px", minWidth: "300px" }}
        >
          <option value="">-- Select an option --</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.symbol} ${option.strike} {option.option_type} {option.expiration}
            </option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      {selectedOption !== null && (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>
                  <input
                    type="number"
                    value={quantities[user.id] || "0"}
                    onChange={(e) =>
                      setQuantities({ ...quantities, [user.id]: e.target.value })
                    }
                    style={{ padding: "5px", width: "100px" }}
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(user.id)}>Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
