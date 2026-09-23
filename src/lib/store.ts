import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { QuantumHoareCert } from "@/lib/cert/hoare";
import type { HotStuffRound } from "@/lib/bft/hotstuff";

export type Locale = "en" | "fa";
export type LogEvent = { t: number; text: string };

type ChimeraState = {
  hydrated: boolean;
  setHydrated: () => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  log: LogEvent[];
  pushLog: (text: string) => void;
  ledger: QuantumHoareCert[];
  lastCert: QuantumHoareCert | null;
  lastRound: HotStuffRound | null;
  lastCounts: Record<string, number> | null;
  lastCorr: { xx: number; yy: number; zz: number } | null;
  recordRound: (
    c: QuantumHoareCert,
    r: HotStuffRound,
    counts?: Record<string, number>,
    corr?: { xx: number; yy: number; zz: number },
  ) => void;
  chat: { role: "user" | "assistant"; content: string }[];
  setChat: (c: ChimeraState["chat"]) => void;
  pushChat: (m: { role: "user" | "assistant"; content: string }) => void;
  clearChat: () => void;
  consoleLines: string[];
  pushConsole: (line: string) => void;
  clearConsole: () => void;
};

export const useChimera = create<ChimeraState>()(
  persist(
    (set) => ({
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      locale: "en",
      setLocale: (locale) => set({ locale }),
      log: [],
      pushLog: (text) =>
        set((s) => ({ log: [...s.log.slice(-80), { t: Date.now(), text }] })),
      ledger: [],
      lastCert: null,
      lastRound: null,
      lastCounts: null,
      lastCorr: null,
      recordRound: (c, r, counts, corr) =>
        set((s) => ({
          lastCert: c,
          lastRound: r,
          lastCounts: counts ?? null,
          lastCorr: corr ?? null,
          ledger: [c, ...s.ledger].slice(0, 40),
        })),
      chat: [],
      setChat: (chat) => set({ chat }),
      pushChat: (m) => set((s) => ({ chat: [...s.chat, m].slice(-40) })),
      clearChat: () => set({ chat: [] }),
      consoleLines: [],
      pushConsole: (line) =>
        set((s) => ({ consoleLines: [...s.consoleLines.slice(-200), line] })),
      clearConsole: () => set({ consoleLines: [] }),
    }),
    {
      name: "chimera-lattice",
      skipHydration: true,
      partialize: (s) => ({
        locale: s.locale,
        ledger: s.ledger,
        chat: s.chat,
        lastCert: s.lastCert,
        lastRound: s.lastRound,
      }),
    },
  ),
);
