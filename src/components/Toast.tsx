import { useEffect, useState } from "react";
import "./Toast.module.css";

export type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

let toastId = 0;
const toastListeners: Set<(messages: ToastMessage[]) => void> = new Set();

function notifyListeners(messages: ToastMessage[]) {
  toastListeners.forEach((listener) => listener(messages));
}

export function showToast(_message: string, _type: ToastType = "info") {
  const id = `toast-${toastId++}`;

  // Get current messages from component state - we'll update via the listener
  const timeout = setTimeout(() => {
    removeToast(id);
  }, 3000);

  return { id, removeToast: () => clearTimeout(timeout) };
}

function removeToast(_id: string) {
  // This will be called from the Toast component
}

export function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAddToast = (message: ToastMessage) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
      }, 3000);
    };

    toastListeners.add((msgs) => {
      if (msgs.length > 0) {
        handleAddToast(msgs[msgs.length - 1]);
      }
    });

    return () => {
      toastListeners.clear();
    };
  }, []);

  return (
    <div className="toast-container">
      {messages.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// Simple toast manager
class ToastManager {
  private messages: ToastMessage[] = [];

  success(message: string) {
    this.show(message, "success");
  }

  error(message: string) {
    this.show(message, "error");
  }

  info(message: string) {
    this.show(message, "info");
  }

  private show(message: string, type: ToastType) {
    const id = `toast-${toastId++}`;
    const toast: ToastMessage = { id, message, type };
    this.messages = [...this.messages, toast];
    notifyListeners(this.messages);

    setTimeout(() => {
      this.messages = this.messages.filter((m) => m.id !== id);
    }, 3000);
  }
}

export const toast = new ToastManager();
