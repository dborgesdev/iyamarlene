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
  expired: boolean;
  recover: () => Promise<void>;
  refresh: () => Promise<void>;
  mutate: (action: string, data: Record<string, unknown>) => Promise<boolean>;
}
const Context = createContext<State | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const draft = useRef<{ id: number; quantity: number }[]>([]);
  const lock = useRef(false);
  const pending = useRef<Promise<void> | null>(null);
  async function request(action = "", data?: Record<string, unknown>) {
    const response = await fetch(`/api/cart${action ? "/" + action : ""}`, {
      method: data ? "POST" : "GET",
      headers: data ? { "Content-Type": "application/json" } : undefined,
      body: data ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
    const value = (await response.json()) as Cart & { message?: string; code?: string };
    if (!response.ok) {
      if (value.code === 'session_expired') setExpired(true);
      throw new Error(
        value.message || "Não foi possível atualizar o carrinho.",
      );
    }
    setCart(value);
    setError("");
    setExpired(false);
    draft.current = value.items.map(({ id, quantity }) => ({ id, quantity }));
    try { localStorage.setItem('iya_cart_draft', JSON.stringify(draft.current)); } catch { /* Cart authority remains WooCommerce when local persistence is unavailable. */ }
  }
  async function recover() {
    await mutate('recover', { items: draft.current });
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
      if (action !== 'recover') await refresh();
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('iya_cart_draft') || '[]') as { id: number; quantity: number }[];
      if (Array.isArray(saved)) draft.current = saved.filter(item => Number.isSafeInteger(item.id) && item.id > 0 && Number.isSafeInteger(item.quantity) && item.quantity > 0);
    } catch { /* Invalid drafts do not override the server cart. */ }
    if (document.cookie.includes("iya_cart_present=1")) void refresh();
    const revalidate = () => { if (document.visibilityState === 'visible' && document.cookie.includes('iya_cart_present=1')) void refresh(); };
    window.addEventListener('focus', revalidate);
    document.addEventListener('visibilitychange', revalidate);
    return () => { window.removeEventListener('focus', revalidate); document.removeEventListener('visibilitychange', revalidate); };
  }, []);
  return (
    <Context.Provider value={{ cart, busy, error, expired, recover, refresh, mutate }}>
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const context = useContext(Context);
  if (!context) throw new Error("Carrinho indisponível");
  return context;
}
