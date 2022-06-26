import { type FC } from "react";
import styles from "./Triangle.module.css";

export interface TriangleProps {
  dir: "up" | "down";
}

const Triangle: FC<TriangleProps> = (props) => (
  <div className={styles.triangle} aria-hidden="true" data-dir={props.dir} />
);

export default Triangle;
