import { Link, useRouterState } from "@tanstack/react-router";
import {
  Atom,
  BookOpen,
  FlaskConical,
  LineChart,
  Menu,
  MessageSquare,
  Network,
  ScrollText,
  Shield,
  Terminal,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useChimera } from "@/lib/store";

const NAV = [
  { to: "/", key: "command" as const, icon: Shield },
  { to: "/lab", key: "lab" as const, icon: FlaskConical },
  { to: "/lattice", key: "lattice" as const, icon: Network },
  { to: "/formal", key: "formal" as const, icon: Atom },
  { to: "/console", key: "console" as const, icon: Terminal },
  { to: "/chat", key: "chat" as const, icon: MessageSquare },
  { to: "/research", key: "research" as const, icon: BookOpen },
  { to: "/markets", key: "markets" as const, icon: LineChart },
  { to: "/ledger", key: "ledger" as const, icon: ScrollText },
];

export function Shell({ children }: { children: ReactNode }) {
  const locale = useChimera((s) => s.locale);
  const setLocale = useChimera((s) => s.setLocale);
  const setHydrated = useChimera((s) => s.setHydrated);
  const t = copy[locale];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const r = useChimera.persist.rehydrate();
    if (r && typeof (r as Promise<void>).then === "function") {
      void (r as Promise<void>).then(() => setHydrated());
    } else {
      setHydrated();
    }
  }, [setHydrated]);

  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-mono text-sm tracking-[0.28em] text-accent">{t.brand}</span>
            <span className="hidden text-xs text-subtle lg:inline">{t.tag}</span>
          </Link>
          <nav className="ms-auto hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-11 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
                    active ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <Icon className="size-3.5" />
                  {t[item.key]}
                </Link>
              );
            })}
          </nav>
          <div className="ms-auto flex items-center gap-2 lg:ms-3">
            <Badge>{t.isolated}</Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLocale(locale === "en" ? "fa" : "en")}
            >
              {locale === "en" ? "FA" : "EN"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="grid grid-cols-2 gap-1 border-t border-border p-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm",
                  pathname === item.to ? "bg-elevated" : "text-muted",
                )}
              >
                <item.icon className="size-4" />
                {t[item.key]}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
