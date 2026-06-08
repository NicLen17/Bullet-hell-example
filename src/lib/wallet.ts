export const WALLET_KEY = "avion-papel-wallet";
export const REVIVE_COST = 22000;

export type PlayerWallet = {
  balance: number;
};

export const DEFAULT_WALLET: PlayerWallet = {
  balance: 0,
};

export function loadWallet(): PlayerWallet {
  if (typeof window === "undefined") return DEFAULT_WALLET;
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) return DEFAULT_WALLET;
    const parsed = JSON.parse(raw) as Partial<PlayerWallet>;
    return { balance: Math.max(0, parsed.balance ?? 0) };
  } catch {
    return DEFAULT_WALLET;
  }
}

export function saveWallet(wallet: PlayerWallet): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  } catch {
    /* quota */
  }
}

export function addToWallet(amount: number): PlayerWallet {
  if (amount <= 0) return loadWallet();
  const current = loadWallet();
  const next = { balance: current.balance + amount };
  saveWallet(next);
  return next;
}

export function spendFromWallet(amount: number): PlayerWallet | null {
  const current = loadWallet();
  if (current.balance < amount) return null;
  const next = { balance: current.balance - amount };
  saveWallet(next);
  return next;
}
