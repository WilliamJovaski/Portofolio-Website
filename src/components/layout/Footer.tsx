import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { footer, nav, site } from "@/data/site";

/** Footer sederhana: nama + tahun, menu mini, dan link sosial. */
export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
      <div className="flex flex-col items-center gap-4 border-t border-dashed border-ink/25 pt-6 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider">
            © {site.copyrightYear} {site.name}
          </p>
          <p className="font-hand text-sm text-ink/80">{footer.note}</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-mono text-[11px] font-semibold uppercase tracking-wider md:gap-x-4">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex min-h-[44px] items-center px-2 text-link underline-offset-4 transition-colors hover:text-link-hover hover:underline active:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus md:min-h-0 md:px-0"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="flex gap-2">
          {site.socials.map((s) => (
            <li key={s.id}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid size-11 min-h-[44px] min-w-[44px] place-items-center rounded-full border-[1.5px] border-primary bg-white text-primary-hover shadow-hard-sm transition-[translate,background-color,color,border-color] hover:-translate-y-0.5 hover:border-ink hover:bg-sky hover:text-ink active:translate-y-0 active:bg-yellow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-focus md:size-9 md:min-h-0 md:min-w-0"
              >
                <Icon name={s.icon} size={16} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
