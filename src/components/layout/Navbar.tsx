"use client";

import { useEffect, useState } from "react";
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
  // Menu mobile terbuka untuk path tertentu -> otomatis tertutup saat route berganti
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  // Esc menutup menu mobile
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenFor(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!introDone) return null;

  // "/case-study/slug" tetap menandai menu CASE STUDY
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const contactActive = isActive(navContact.href);
  // Ikon HOME berupa bintang seperti referensi
  const iconFor = (href: string, icon: (typeof nav)[number]["icon"]) => (href === "/" ? "star" : icon);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-ink/10 bg-paper"
    >
      <nav aria-label="Navigasi utama" className="mx-auto flex h-14 max-w-6xl items-stretch px-4">
        {/* Logo brand William Jovaski */}
        <Link href="/" aria-label={`${site.name}, ke Home`} className="flex min-h-[44px] min-w-[44px] shrink-0 items-center pr-3">
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
                    "flex items-center gap-1.5 px-3 transition-colors",
                    itemText,
                    active ? "bg-yellow" : "hover:bg-ink/5"
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
                    "grid size-7 place-items-center rounded-full border border-ink/25 transition-transform hover:-translate-y-0.5",
                    accentBg[s.color]
                  )}
                >
                  <Icon name={s.icon} size={13} />
                </a>
              </li>
            ))}
          </ul>

          {/* Tombol CONTACT: kotak outline, ikon hati di kiri */}
          <Link
            href={navContact.href}
            aria-current={contactActive ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-1.5 border border-ink px-3.5 transition-colors md:h-9 md:min-h-0 md:px-3",
              itemText,
              contactActive ? "bg-ink text-white" : "bg-white hover:bg-ink hover:text-white"
            )}
          >
            <Icon name={navContact.icon} size={11} />
            {navContact.label}
          </Link>

          {/* Hamburger (mobile, min 44x44px touch target) */}
          <button
            type="button"
            className="grid size-11 min-h-[44px] min-w-[44px] place-items-center border border-ink bg-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </nav>

      {/* Panel menu mobile */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-y border-ink/10 bg-paper shadow-paper md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenFor(null)}
                    className={cn(
                      "flex min-h-[44px] items-center gap-2 border-b border-dashed border-ink/15 px-2 py-3",
                      itemText,
                      active && "bg-yellow"
                    )}
                  >
                    <Icon name={iconFor(item.href, item.icon)} size={12} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mx-auto flex max-w-6xl gap-2 px-4 pt-1 pb-4">
            {site.socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={cn(
                    "grid size-11 min-h-[44px] min-w-[44px] place-items-center rounded-full border border-ink/25",
                    accentBg[s.color]
                  )}
                >
                  <Icon name={s.icon} size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.header>
  );
}
