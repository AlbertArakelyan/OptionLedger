import { useState, useEffect } from "react";
import { User, Option, listUsers as listUsersApi, listOptions as listOptionsApi, setOwnership as setOwnershipApi, getOwnerships as getOwnershipsApi, OptionOwnership } from "../api";
import { Table, LoadingSpinner, toast } from "../components";
import styles from "./OwnershipPage.module.css";

export default function OwnershipPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [ownerships, setOwnerships] = useState<OptionOwnership[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, optionsData, ownershipsData] = await Promise.all([
        listUsersApi(),
        listOptionsApi(),
        getOwnershipsApi(),
      ]);
      setUsers(usersData);
      setOptions(optionsData);
      setOwnerships(ownershipsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOption !== null) {
      const newQuantities: Record<number, string> = {};
      users.forEach((user) => {
        const ownership = ownerships.find((o) => o.user_id === user.id && o.option_id === selectedOption);
        newQuantities[user.id] = ownership ? String(ownership.quantity) : "0";
      });
      setQuantities(newQuantities);
    }
  }, [selectedOption, users, ownerships]);

  const handleSave = async (userId: number) => {
    if (selectedOption === null) return;
    setSavingUserId(userId);
    try {
      const quantity = parseInt(quantities[userId] || "0", 10);
      if (quantity < 0) {
        toast.error("Quantity cannot be negative");
        setSavingUserId(null);
        return;
      }
      await setOwnershipApi(userId, selectedOption, quantity);
      toast.success("Ownership updated successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to update ownership");
    } finally {
      setSavingUserId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading data..." />;
  }

  const selectedOptionData = options.find((o) => o.id === selectedOption);
  const tableRows = users.map((user) => [
    user.name,
    <input
      key={`qty-${user.id}`}
      type="number"
      min="0"
      value={quantities[user.id] || "0"}
      onChange={(e) => setQuantities({ ...quantities, [user.id]: e.target.value })}
      className={styles.qtyInput}
      disabled={savingUserId !== null}
    />,
    <button key={`save-${user.id}`} onClick={() => handleSave(user.id)} disabled={savingUserId !== null} className="btn-success">
      {savingUserId === user.id ? "Saving..." : "Save"}
    </button>,
  ]);

  return (
    <div className={styles.pageContainer}>
      <h2>Ownership Editor</h2>

      <div className={styles.selectorContainer}>
        <label htmlFor="option-select">Select Option:</label>
        <select
          id="option-select"
          value={selectedOption ?? ""}
          onChange={(e) => setSelectedOption(e.target.value ? Number(e.target.value) : null)}
          className={styles.optionSelect}
        >
          <option value="">-- Select an option --</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.symbol} ${option.strike.toFixed(2)} {option.option_type.toUpperCase()} {option.expiration}
            </option>
          ))}
        </select>
      </div>

      {selectedOption !== null && selectedOptionData && (
        <div className={styles.optionInfo}>
          <p>
            <strong>Selected:</strong> {selectedOptionData.symbol} ${selectedOptionData.strike.toFixed(2)} {selectedOptionData.option_type.toUpperCase()}{" "}
            {selectedOptionData.expiration}
          </p>
        </div>
      )}

      {selectedOption !== null && <Table headers={["User", "Quantity", "Actions"]} rows={tableRows} emptyMessage="No users available." />}

      {!selectedOption && <div className={styles.emptyState}>Please select an option to manage ownership</div>}
    </div>
  );
}
