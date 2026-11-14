/** Garis lengkung sangat landai, full-width (tepi ke tepi layar), 1px abu muda. */
export default function CurvedDivider() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 50"
      preserveAspectRatio="none"
      className="block h-12 w-full text-ink/15"
    >
      {/* Ujung kiri & kanan lebih rendah, tengah sedikit naik */}
      <path
        d="M0 46Q500 4 1000 46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
