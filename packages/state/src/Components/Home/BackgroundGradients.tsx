import classNames from "classnames";

export function BackgroundGradients() {
  return (
    <>
      {/* <LinearGradient top={800} height={3000} left="0" width={"100%"} /> */}
      <LinearGradient top={800} height={3000} left="0" width={"100%"} gradient="bg-gradient-to-t" />
      <LinearGradient top={3800} height={2200} left="0" width={"100%"} gradient="bg-gradient-to-b" />
      <LinearGradient top={6000} height={2000} left="0" width={"100%"} gradient="bg-gradient-to-t" />
    </>
  );
}
// function RadialGradient({
//   top,
//   height,
//   left,
//   width,
//   flip,
// }: {
//   top: number;
//   height: number;
//   left: number | string;
//   width: number | string;
//   flip?: boolean;
// }) {
//   const brightness = 0.04;
//   const color = Math.round(255 * brightness);
//   const hex = rgbToHex(color, color, color);
//   return (
//     <div
//       className="absolute -z-10"
//       style={{
//         top,
//         height,
//         left,
//         width,
//         background: `
//           radial-gradient(ellipse at center, ${hex} 0%, #0d1117 50%)
//         `,
//       }}
//     ></div>
//   );

// }
export function LinearGradient({
  top,
  height,
  left,
  width,
  gradient
}: {
  top: number;
  height: number;
  left: number | string;
  width: number | string;
  gradient?: `bg-gradient-to-${string}`
}) {
  return (
    <div
      className={classNames(
        "absolute -z-10 from-[#161a25] to-[#0d1117] !mt-0",
        // "absolute -z-10 from-[#141822] to-[#0d1117] !mt-0",
        gradient
      )}
      style={{
        top,
        height,
        left,
        width,
      }}
    ></div>
  );
}

// function rgbToHex(r: number, g: number, b: number): string {
//   return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
// }
