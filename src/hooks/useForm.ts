"use client";

import { useState, useCallback } from "react";
import { z } from "zod";

interface UseFormOptions<T extends z.ZodType> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
}

interface FormState<T> {
  data: Partial<T>;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export function useForm<T extends z.ZodType>({
  schema,
  defaultValues = {},
  onSubmit,
}: UseFormOptions<T>) {
  type FormData = z.infer<T>;

  const [state, setState] = useState<FormState<FormData>>({
    data: defaultValues as Partial<FormData>,
    errors: {},
    isSubmitting: false,
    isValid: false,
    isDirty: false,
  });

  const setValue = useCallback(
    (field: keyof FormData, value: unknown) => {
      setState((prev) => {
        const newData = { ...prev.data, [field]: value };

        // Clear field error when value changes
        const newErrors = { ...prev.errors };
        delete newErrors[field];

        return {
          ...prev,
          data: newData,
          errors: newErrors,
          isDirty: true,
        };
      });
    },
    []
  );

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(state.data);

    if (!result.success) {
      const errors: Partial<Record<keyof FormData, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      setState((prev) => ({
        ...prev,
        errors,
        isValid: false,
      }));

      return false;
    }

    setState((prev) => ({
      ...prev,
      errors: {},
      isValid: true,
    }));

    return true;
  }, [schema, state.data]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validate()) {
        return;
      }

      setState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        await onSubmit(state.data as FormData);
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          isDirty: false,
        }));
      } catch (error) {
        console.error("Form submission error:", error);
        setState((prev) => ({ ...prev, isSubmitting: false }));
        throw error;
      }
    },
    [validate, onSubmit, state.data]
  );

  const reset = useCallback(() => {
    setState({
      data: defaultValues as Partial<FormData>,
      errors: {},
      isSubmitting: false,
      isValid: false,
      isDirty: false,
    });
  }, [defaultValues]);

  const getFieldProps = useCallback(
    (field: keyof FormData) => ({
      value: state.data[field] ?? "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => setValue(field, e.target.value),
      error: state.errors[field],
    }),
    [state.data, state.errors, setValue]
  );

  return {
    data: state.data,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    isDirty: state.isDirty,
    setValue,
    validate,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

export default useForm;
