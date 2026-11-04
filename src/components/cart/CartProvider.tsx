import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Cart } from "../../lib/commerce";
interface State {
  cart: Cart | null;
  busy: boolean;
  error: string;
  refresh: () => Promise<void>;
  mutate: (action: string, data: Record<string, unknown>) => Promise<boolean>;
}
const Context = createContext<State | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const pending = useRef<Promise<void> | null>(null);
  async function request(action = "", data?: Record<string, unknown>) {
    const response = await fetch(`/api/cart${action ? "/" + action : ""}`, {
      method: data ? "POST" : "GET",
      headers: data ? { "Content-Type": "application/json" } : undefined,
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
    const value = (await response.json()) as Cart & { message?: string };
    if (!response.ok)
      throw new Error(
        value.message || "Não foi possível atualizar o carrinho.",
      );
    setCart(value);
  }
  async function refresh() {
    if (pending.current) return pending.current;
    pending.current = request()
      .catch((e: Error) => setError(e.message))
      .finally(() => {
        pending.current = null;
      });
    return pending.current;
  }
  async function mutate(action: string, data: Record<string, unknown>) {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (pending.current) await pending.current;
      await request(action, data);
      return true;
    } catch (e) {
      setError((e as Error).message);
      await refresh();
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    if (document.cookie.includes("iya_cart_present=1")) void refresh();
  }, []);
  return (
    <Context.Provider value={{ cart, busy, error, refresh, mutate }}>
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const context = useContext(Context);
  if (!context) throw new Error("Carrinho indisponível");
  return context;
}
