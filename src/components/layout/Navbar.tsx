"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useIntro } from "@/components/intro/IntroProvider";
import { Icon, Smiley } from "@/components/ui/Icons";
import { accentBg } from "@/components/ui/colors";
import { nav, navContact, site } from "@/data/site";
import { cn } from "@/lib/cn";

const itemText = "font-mono text-[11px] font-medium uppercase tracking-[0.12em]";

/** Navbar full-width sticky, latar solid supaya kartu tidak terlihat menembus. Baru tampil setelah intro selesai. */
export default function Navbar() {
  const pathname = usePathname();
  const { introDone } = useIntro();
  const headerRef = useRef<HTMLElement>(null);
  // Menu mobile terbuka untuk path tertentu -> otomatis tertutup saat route berganti
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  // Esc atau klik di luar menutup menu mobile
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFor(null);
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (headerRef.current && target && !headerRef.current.contains(target)) {
        setOpenFor(null);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  if (!introDone) return null;

  // "/case-study/slug" tetap menandai menu CASE STUDY
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const contactActive = isActive(navContact.href);
  // Ikon HOME berupa bintang seperti referensi
  const iconFor = (href: string, icon: (typeof nav)[number]["icon"]) => (href === "/" ? "star" : icon);

  return (
    <motion.header
      ref={headerRef}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-ink/15 bg-paper"
    >
      <nav aria-label="Navigasi utama" className="mx-auto flex h-14 max-w-6xl items-stretch px-4">
        {/* Logo brand William Jovaski */}
        <Link
          href="/"
          aria-label={`${site.name}, ke Home`}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center pr-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus"
        >
          <Smiley size={28} />
        </Link>

        {/* Menu desktop */}
        <ul className="hidden items-stretch md:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="flex">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 px-3 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus",
                    itemText,
                    active
                      ? "bg-yellow font-bold text-ink"
                      : "text-ink hover:bg-sky/70 hover:text-primary-hover active:bg-yellow"
                  )}
                >
                  <Icon name={iconFor(item.href, item.icon)} size={11} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {/* Tombol sosial bulat (desktop) */}
          <ul className="hidden items-center gap-1.5 md:flex">
            {site.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={cn(
                    "grid size-7 place-items-center rounded-full border border-ink/35 transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-hard-sm active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus",
                    accentBg[s.color]
                  )}
                >
                  <Icon name={s.icon} size={13} />
                </a>
              </li>
            ))}
          </ul>

          {/* Tombol CONTACT (Primary CTA di Navbar) */}
          <Link
            href={navContact.href}
            aria-current={contactActive ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-1.5 rounded-md border-[1.5px] border-ink px-3.5 shadow-hard-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus md:h-9 md:min-h-0 md:px-3",
              itemText,
              "font-bold",
              contactActive
                ? "bg-primary-hover text-white"
                : "bg-primary text-white hover:bg-primary-hover active:bg-ink"
            )}
          >
            <Icon name={navContact.icon} size={11} />
            {navContact.label}
          </Link>

          {/* Tombol Burger Menu (mobile: ikon + teks "Menu" / "Tutup", min 44x44px) */}
          <button
            type="button"
            className={cn(
              "inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md border-[1.5px] border-ink px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-hard-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50 md:hidden",
              open
                ? "bg-primary-hover text-white hover:bg-primary active:bg-ink"
                : "bg-white text-ink hover:border-primary hover:bg-sky hover:text-primary-hover active:bg-yellow"
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
            <span>{open ? "Tutup" : "Menu"}</span>
          </button>
        </div>
      </nav>

      {/* Panel menu mobile */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-y-[1.5px] border-ink bg-white shadow-paper-lg md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-3">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenFor(null)}
                    className={cn(
                      "flex min-h-[48px] items-center gap-3 rounded-md border-[1.5px] px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus",
                      active
                        ? "border-ink bg-primary text-white shadow-hard-sm"
                        : "border-transparent bg-paper text-ink hover:border-primary hover:bg-sky hover:text-primary-hover active:bg-yellow"
                    )}
                  >
                    <Icon name={iconFor(item.href, item.icon)} size={15} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mx-auto flex max-w-6xl items-center justify-between border-t border-dashed border-ink/20 px-4 pt-3 pb-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-ink/75">
              Socials
            </span>
            <ul className="flex gap-2.5">
              {site.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                      "grid size-11 min-h-[44px] min-w-[44px] place-items-center rounded-full border-[1.5px] border-ink shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus",
                      accentBg[s.color]
                    )}
                  >
                    <Icon name={s.icon} size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.header>
  );
}
