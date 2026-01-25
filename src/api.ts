import { invoke } from "@tauri-apps/api/core";

export interface User {
  id: number;
  name: string;
}

export interface Option {
  id: number;
  symbol: string;
  option_type: "call" | "put";
  strike: number;
  expiration: string;
}

export interface OptionOwnership {
  user_id: number;
  option_id: number;
  quantity: number;
}

export interface MatrixView {
  users: User[];
  rows: MatrixRow[];
}

export interface MatrixRow {
  option: Option;
  quantities: number[];
}

// User API
export const createUser = (name: string): Promise<User> =>
  invoke("create_user", { name });

export const listUsers = (): Promise<User[]> => invoke("list_users");

export const deleteUser = (id: number): Promise<void> =>
  invoke("delete_user", { id });

// Option API
export const createOption = (
  symbol: string,
  optionType: "call" | "put",
  strike: number,
  expiration: string
): Promise<Option> =>
  invoke("create_option", {
    symbol,
    optionType,
    strike,
    expiration,
  });

export const listOptions = (): Promise<Option[]> => invoke("list_options");

export const deleteOption = (id: number): Promise<void> =>
  invoke("delete_option", { id });

// Ownership API
export const setOwnership = (
  userId: number,
  optionId: number,
  quantity: number
): Promise<void> =>
  invoke("set_ownership", {
    userId,
    optionId,
    quantity,
  });

export const getOwnerships = (): Promise<OptionOwnership[]> =>
  invoke("get_ownerships");

export const getMatrixView = (): Promise<MatrixView> =>
  invoke("get_matrix_view");
