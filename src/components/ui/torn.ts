/**
 * clip-path polygon untuk tepi "sobek" (zig-zag) di atas dan/atau bawah elemen.
 * teeth = jumlah gigi, depth = kedalaman gigi (px).
 */
export function tornClipPath({
  top = false,
  bottom = true,
  teeth = 16,
  depth = 5,
}: { top?: boolean; bottom?: boolean; teeth?: number; depth?: number } = {}) {
  const points: string[] = [];

  // Tepi atas: kiri -> kanan
  if (top) {
    for (let i = 0; i <= teeth; i++) {
      const x = (i / teeth) * 100;
      points.push(`${x}% ${i % 2 === 0 ? `${depth}px` : "0px"}`);
    }
  } else {
    points.push("0% 0%", "100% 0%");
  }

  // Tepi bawah: kanan -> kiri
  if (bottom) {
    for (let i = teeth; i >= 0; i--) {
      const x = (i / teeth) * 100;
      points.push(`${x}% ${i % 2 === 0 ? `calc(100% - ${depth}px)` : "100%"}`);
    }
  } else {
    points.push("100% 100%", "0% 100%");
  }

  return `polygon(${points.join(", ")})`;
}
