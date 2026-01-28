import { useEffect, useState } from "react";
import { User, listUsers as listUsersApi, createUser as createUserApi, deleteUser as deleteUserApi } from "../../api";
import { Table, FormInput, ConfirmModal, LoadingSpinner, toast } from "../../components";
import { useFormState } from "../../hooks";
import styles from "./UsersPage.module.css";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: number | null }>({ isOpen: false, userId: null });

  const form = useFormState(
    { name: "" },
    async (values) => {
      await createUserApi(values.name.trim());
      toast.success("User created successfully");
      await loadUsers();
    },
    (values) => {
      const errors: Record<string, string> = {};
      if (!values.name.trim()) {
        errors.name = "User name is required";
      }
      if (values.name.length > 100) {
        errors.name = "Name must be less than 100 characters";
      }
      return errors;
    }
  );

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await listUsersApi();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirmModal.userId === null) return;
    try {
      await deleteUserApi(confirmModal.userId);
      toast.success("User deleted successfully");
      setConfirmModal({ isOpen: false, userId: null });
      await loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  const tableRows = users.map((user) => [
    user.id,
    user.name,
    <button key="delete" onClick={() => setConfirmModal({ isOpen: true, userId: user.id })} className={styles.btnDangerSmall}>
      Delete
    </button>,
  ]);

  return (
    <div className={styles.pageContainer}>
      <h2>Users Manager</h2>

      <form onSubmit={form.handleSubmit} className={styles.formContainer}>
        <FormInput
          label="User Name"
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          placeholder="Enter user name"
          error={form.errors.name}
          disabled={form.loading}
        />
        {form.submitError && <div className="error">{form.submitError}</div>}
        <button type="submit" disabled={form.loading} className={styles.btnAdd}>
          {form.loading ? "Adding..." : "Add User"}
        </button>
      </form>

      <Table headers={["ID", "Name", "Actions"]} rows={tableRows} emptyMessage="No users yet. Create one to get started!" />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmModal({ isOpen: false, userId: null })}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}
