import classNames from "classnames";

export function BackgroundGradients() {
    const light = '1b1b27';
    const dark = "0d1117";
  return (
      <div
          className="absolute inset-0 background-gradients -z-10"
          style={{
              background: `linear-gradient(
            to bottom,
            #${dark} 0%,
            #${light} 31%,
            #${light} 35%,
            #${dark} 66%,
            #${light} 90%
          )`,
          }}
      />
  );
}