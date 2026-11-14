import Chip from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icons";
import Polaroid from "@/components/ui/Polaroid";
import { accentBg } from "@/components/ui/colors";
import { profilePhoto } from "@/data/about";
import { whatsUp } from "@/data/site";
import { cn } from "@/lib/cn";

const tilt = [-2, 1.5, 2, -1.5];

/** Layar 3: bio tulisan tangan, dua polaroid miring, chip skill. */
export default function WhatsUp() {
  // Polaroid kiri = foto profil (diganti sekali di src/data/about.ts)
  const left = { ...whatsUp.polaroids[0], ...profilePhoto };
  const right = whatsUp.polaroids[1];

  return (
    <section aria-labelledby="whats-up" className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:pb-20">
      {/* Label tepat di bawah garis lengkung, sejajar kolom konten */}
      <p className="font-hand text-[14px] text-ink/80">{whatsUp.label}</p>

      {/* Mobile: teks di atas, 2 polaroid berdampingan. Desktop: polaroid kiri - teks - polaroid kanan */}
      <div className="mt-8 grid grid-cols-1 min-[360px]:grid-cols-2 items-center gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-[260px_1fr_240px]">
        <div className="order-2 lg:order-1 lg:mt-24">
          <Polaroid
            {...left}
            rotate={-5}
            fit="auto"
            aspect="h-auto"
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 200px, 160px"
            className="mx-auto w-[clamp(160px,18vw,260px)] lg:w-[260px] max-w-full"
          />
        </div>

        <div className="order-1 col-span-full text-center lg:order-2 lg:col-span-1 lg:px-4">
          <h2 id="whats-up">
            <Chip variant="box" color="white">
              {whatsUp.chip}
            </Chip>
          </h2>
          <p className="mx-auto mt-8 max-w-[680px] font-hand text-[clamp(16px,1.8vw,20px)] leading-[1.7] text-ink">
            {whatsUp.bio}
          </p>

          <ul className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-3 sm:gap-3.5">
            {whatsUp.skills.map((s, i) => (
              <li
                key={s.label}
                className="flex max-w-full items-center gap-1.5"
                style={{ transform: `rotate(${tilt[i % tilt.length]}deg)` }}
              >
                <Chip variant="sticker" color={s.color}>
                  {s.label}
                </Chip>
                <span aria-hidden="true" className={cn("grid size-9 shrink-0 place-items-center", accentBg[s.color])}>
                  <Icon name="sparkle" size={14} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-3 lg:-mt-20">
          <Polaroid
            {...right}
            rotate={4}
            fit="auto"
            aspect="h-auto"
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 180px, 150px"
            className="mx-auto w-[clamp(150px,16vw,240px)] lg:w-[240px] max-w-full"
          />
        </div>
      </div>
    </section>
  );
}
