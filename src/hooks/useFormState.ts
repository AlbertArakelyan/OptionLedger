import { useState, useCallback } from "react";

interface FormErrors {
  [key: string]: string;
}

export function useFormState<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>,
  validate?: (values: T) => FormErrors
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError("");

      if (validate) {
        const newErrors = validate(values);
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        }
      }

      setLoading(true);
      try {
        await onSubmit(values);
        setValues(initialValues);
        setErrors({});
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        setSubmitError(message);
      } finally {
        setLoading(false);
      }
    },
    [values, onSubmit, validate, initialValues]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError("");
  }, [initialValues]);

  return {
    values,
    errors,
    loading,
    submitError,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}
