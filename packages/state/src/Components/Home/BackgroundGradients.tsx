import classNames from "classnames";

export function BackgroundGradients() {
  return (
    <div
      className="absolute inset-0 background-gradients -z-10"
      style={{
        background: `linear-gradient(
            to bottom,
            #000000 0%,
            #262631 30%,
            #262631 36%,
            #000000 66%,
            #262631 90%
          )`,
      }}
    />
  );
}