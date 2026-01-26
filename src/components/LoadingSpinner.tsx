import "./LoadingSpinner.module.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

export function LoadingSpinner({ size = "medium", message }: LoadingSpinnerProps) {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner"></div>
      {message && <p>{message}</p>}
    </div>
  );
}
