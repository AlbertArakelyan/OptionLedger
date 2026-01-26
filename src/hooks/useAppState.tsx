import { createContext, useContext, useState, ReactNode } from "react";
import { User, Option, OptionOwnership, MatrixView } from "../api";

interface AppContextType {
  users: User[];
  setUsers: (users: User[]) => void;
  options: Option[];
  setOptions: (options: Option[]) => void;
  ownerships: OptionOwnership[];
  setOwnerships: (ownerships: OptionOwnership[]) => void;
  matrix: MatrixView | null;
  setMatrix: (matrix: MatrixView | null) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [ownerships, setOwnerships] = useState<OptionOwnership[]>([]);
  const [matrix, setMatrix] = useState<MatrixView | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const value = {
    users,
    setUsers,
    options,
    setOptions,
    ownerships,
    setOwnerships,
    matrix,
    setMatrix,
    refreshKey,
    triggerRefresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
