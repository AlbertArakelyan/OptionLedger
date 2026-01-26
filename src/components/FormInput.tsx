import "./FormInput.module.css";

interface FormInputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  step?: string;
  options?: Array<{ value: string; label: string }>;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  step,
  options,
  disabled,
}: FormInputProps) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      {options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={error ? "input-error" : ""}
          disabled={disabled}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          className={error ? "input-error" : ""}
          disabled={disabled}
        />
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
