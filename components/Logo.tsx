import { type FC, memo } from "react";
import Link from "next/link";
import clsx from "clsx";

const content = "npm version downloads";

const Logo: FC<{ link?: boolean }> = memo(function Logo(props) {
  const text = (
    <span
      className={clsx(
        "whitespace-nowrap",
        props.link ? "hidden sm:inline-block" : "inline-block"
      )}
    >
      {content}
    </span>
  );

  return !props.link ? (
    text
  ) : (
    <Link href="/">
      <a>{text}</a>
    </Link>
  );
});

export default Logo;
