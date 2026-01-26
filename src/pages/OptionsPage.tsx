import { useEffect, useState } from "react";
import { Option, listOptions as listOptionsApi, createOption as createOptionApi, deleteOption as deleteOptionApi } from "../api";
import { Table, FormInput, ConfirmModal, LoadingSpinner, toast } from "../components";
import { useFormState } from "../hooks";
import styles from "./OptionsPage.module.css";

export default function OptionsPage() {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; optionId: number | null }>({ isOpen: false, optionId: null });

  const form = useFormState(
    { symbol: "", optionType: "call", strike: "", expiration: "" },
    async (values) => {
      await createOptionApi(values.symbol.trim(), values.optionType as "call" | "put", parseFloat(values.strike), values.expiration);
      toast.success("Option created successfully");
      await loadOptions();
    },
    (values) => {
      const errors: Record<string, string> = {};
      if (!values.symbol.trim()) {
        errors.symbol = "Symbol is required";
      }
      if (!values.strike || parseFloat(values.strike) <= 0) {
        errors.strike = "Strike must be a positive number";
      }
      if (!values.expiration) {
        errors.expiration = "Expiration date is required";
      }
      return errors;
    }
  );

  const loadOptions = async () => {
    setLoading(true);
    try {
      const data = await listOptionsApi();
      setOptions(data);
    } catch (error) {
      toast.error("Failed to load options");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirmModal.optionId === null) return;
    try {
      await deleteOptionApi(confirmModal.optionId);
      toast.success("Option deleted successfully");
      setConfirmModal({ isOpen: false, optionId: null });
      await loadOptions();
    } catch (error) {
      toast.error("Failed to delete option");
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading options..." />;
  }

  const tableRows = options.map((option) => [
    option.id,
    option.symbol,
    option.option_type.toUpperCase(),
    `$${option.strike.toFixed(2)}`,
    option.expiration,
    <button key="delete" onClick={() => setConfirmModal({ isOpen: true, optionId: option.id })} className={styles.btnDangerSmall}>
      Delete
    </button>,
  ]);

  return (
    <div className={styles.pageContainer}>
      <h2>Options Manager</h2>

      <form onSubmit={form.handleSubmit} className={styles.formContainer}>
        <FormInput
          label="Symbol"
          name="symbol"
          value={form.values.symbol}
          onChange={form.handleChange}
          placeholder="e.g. AAPL"
          error={form.errors.symbol}
          disabled={form.loading}
        />
        <FormInput
          label="Type"
          name="optionType"
          value={form.values.optionType}
          onChange={form.handleChange}
          error={form.errors.optionType}
          options={[
            { value: "call", label: "Call" },
            { value: "put", label: "Put" },
          ]}
          disabled={form.loading}
        />
        <FormInput
          label="Strike"
          name="strike"
          type="number"
          step="0.01"
          value={form.values.strike}
          onChange={form.handleChange}
          placeholder="Strike price"
          error={form.errors.strike}
          disabled={form.loading}
        />
        <FormInput
          label="Expiration"
          name="expiration"
          type="date"
          value={form.values.expiration}
          onChange={form.handleChange}
          error={form.errors.expiration}
          disabled={form.loading}
        />
        {form.submitError && <div className="error">{form.submitError}</div>}
        <button type="submit" disabled={form.loading} className={styles.btnAdd}>
          {form.loading ? "Adding..." : "Add Option"}
        </button>
      </form>

      <Table headers={["ID", "Symbol", "Type", "Strike", "Expiration", "Actions"]} rows={tableRows} emptyMessage="No options yet. Create one to get started!" />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Option"
        message="Are you sure you want to delete this option? This will also delete all associated ownership records."
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, optionId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
