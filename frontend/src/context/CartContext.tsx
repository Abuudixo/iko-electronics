import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Money, Product, VariantOption } from "@/types/catalog";

const STORAGE_KEY = "iko.cart.v1";

/**
 * A line is identified by product **plus chosen option** — the same headphones
 * in charcoal and in navy are two lines, not one.
 */
function sameLine(l: CartLine, productId: string, optionName: string | null): boolean {
  return l.productId === productId && l.optionName === optionName;
}

type CartValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: Money;
  add: (product: Product, option: VariantOption | null, quantity: number) => void;
  setQuantity: (productId: string, optionName: string | null, quantity: number) => void;
  remove: (productId: string, optionName: string | null) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function readStorage(): CartLine[] {
  // Storage can throw outright in private mode or when site data is blocked.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Persisting is a convenience — never break checkout over it.
    }
  }, [lines]);

  const add = useCallback((product: Product, option: VariantOption | null, quantity: number) => {
    setLines((prev) => {
      const optionName = option?.label ?? null;

      if (prev.some((l) => sameLine(l, product.id, optionName))) {
        return prev.map((l) =>
          sameLine(l, product.id, optionName)
            ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) }
            : l,
        );
      }

      const line: CartLine = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        sku: product.sku,
        optionLabel: product.optionLabel ?? null,
        optionName: option?.label ?? null,
        // Price is snapshotted at add time so a mid-session price change in
        // Odoo cannot silently alter what someone already agreed to.
        unitPrice: product.price,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock,
      };
      return [...prev, line];
    });
  }, []);

  const setQuantity = useCallback((productId: string, optionName: string | null, quantity: number) => {
    setLines((prev) =>
      prev.flatMap((l) => {
        if (!sameLine(l, productId, optionName)) return [l];
        // Dropping to zero removes the line rather than leaving an empty row.
        if (quantity <= 0) return [];
        return [{ ...l, quantity: Math.min(quantity, l.stock) }];
      }),
    );
  }, []);

  const remove = useCallback((productId: string, optionName: string | null) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, productId, optionName)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartValue>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
    return { lines, itemCount, subtotal, add, setQuantity, remove, clear };
  }, [lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
