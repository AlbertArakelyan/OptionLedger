import { useState, useEffect } from "react";
import { User, createUser, listUsers, deleteUser } from "../api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createUser(name.trim());
      setName("");
      await loadUsers();
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
      setError("");
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div>
      <h2>Users Manager</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User name"
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button type="submit">Add User</button>
      </form>
      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
      <table border={1} cellPadding={8} cellSpacing={0} style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
