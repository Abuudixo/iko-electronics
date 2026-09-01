import { Minus, Plus } from "lucide-react";

/**
 * Quantity control.
 *
 * The visible number is text rather than an <input> because free typing invites
 * "0", "-1" and "999" and every one of those needs handling. The value is still
 * announced: the buttons carry their own labels, and the count is exposed with
 * aria-live so a screen reader hears it change.
 */
export default function QuantityStepper({
  value,
  onChange,
  max,
  label = "Quantity",
}: {
  value: number;
  onChange: (next: number) => void;
  /** Usually the stock level — never let someone order more than exists. */
  max: number;
  label?: string;
}) {
  const canDecrease = value > 1;
  const canIncrease = value < max;

  return (
    <div className="inline-flex items-center rounded border border-outline-variant">
      <button
        type="button"
        onClick={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className="grid size-11 place-items-center rounded-l text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:text-outline-variant"
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>

      <span
        aria-live="polite"
        aria-atomic="true"
        className="w-10 text-center text-body-md font-semibold tabular-nums"
      >
        <span className="sr-only">{label}: </span>
        {value}
      </span>

      <button
        type="button"
        onClick={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        aria-label={`Increase ${label.toLowerCase()}`}
        className="grid size-11 place-items-center rounded-r text-on-surface transition-colors hover:bg-surface-container disabled:cursor-not-allowed disabled:text-outline-variant"
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
