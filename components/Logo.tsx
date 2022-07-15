import { type FC, memo } from "react";
import Link from "next/link";

const content = "npm version downloads";

const Logo: FC<{ link?: boolean }> = memo(function Logo(props) {
  return props.link ? <Link href="/">{content}</Link> : <span>{content}</span>;
});

export default Logo;
