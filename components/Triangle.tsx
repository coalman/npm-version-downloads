import cx from "clsx";

export interface TriangleProps {
  dir: "up" | "down";
}

/**
 * NOTE: borderSize and borderSize/2 must be valid border widths in tailwind.
 */
const borderSize = 8;

const Triangle = (props: TriangleProps) => (
  <div
    className={cx(
      "w-0 h-0 inline-block border-solid border-transparent",
      `border-${borderSize / 2}`,
      props.dir === "up" &&
        `border-t-0 border-b-${borderSize} border-b-slate-50`,
      props.dir === "down" &&
        `border-b-0 border-t-${borderSize} border-t-slate-50`
    )}
    aria-hidden="true"
  />
);

export default Triangle;
