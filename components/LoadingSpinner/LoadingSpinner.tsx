import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => (
  <div>
    <div className={styles.loadingSpinner} />
    <span className={styles.loadingText}>Loading...</span>
  </div>
);

export default LoadingSpinner;
