import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const CONTROL =
  "h-12 w-full rounded-md border-2 bg-surface-lowest px-4 text-body-md text-on-surface placeholder:text-on-surface-variant shadow-sm focus:outline-none disabled:bg-surface-container disabled:text-outline";

function control(hasError: boolean) {
  return cn(
    CONTROL,
    hasError
      ? "border-error focus:border-error"
      : "border-[#b5b1c7] focus:border-2 focus:border-primary",
  );
}

type Common = {
  label: string;
  hint?: string;
  error?: string;
  /** Visually hides the label but keeps it for screen readers. */
  hideLabel?: boolean;
};

function Wrapper({
  id,
  label,
  hint,
  error,
  hideLabel,
  children,
}: Common & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={cn("text-label-sm font-semibold text-black", hideLabel && "sr-only")}>
        {label}
      </label>
      {children}
      {/*
        Errors are wired with aria-describedby and announced politely rather
        than only turning the border red — colour alone is not an error message.
      */}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-label-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-label-sm text-on-surface-variant">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & Common;

export function TextField({ label, hint, error, hideLabel, className, ...rest }: InputProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <Wrapper id={id} label={label} hint={hint} error={error} hideLabel={hideLabel}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(control(!!error), className)}
        {...rest}
      />
    </Wrapper>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  Common & { children: ReactNode };

export function SelectField({
  label,
  hint,
  error,
  hideLabel,
  className,
  children,
  ...rest
}: SelectProps) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <Wrapper id={id} label={label} hint={hint} error={error} hideLabel={hideLabel}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(control(!!error), "cursor-pointer pr-10", className)}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}
