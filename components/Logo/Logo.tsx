import { type FC, memo } from "react";
import Link from "next/link";
import styles from "./Logo.module.css";

const content = "npm-version-downloads";

const Logo: FC<{ link?: boolean }> = memo(function Logo(props) {
  return props.link ? (
    <Link href="/">{content}</Link>
  ) : (
    <span className={styles.logo}>{content}</span>
  );
});

export default Logo;
