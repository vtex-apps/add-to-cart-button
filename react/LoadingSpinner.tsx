import React, { FC } from "react";
import styles from "./css/loading-spinner.module.css";

const LoadingSpinner: FC = () => {
  return (
    <svg
      className={styles.loadingSpinner}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      height="12"
      width="12"
    >
      <circle
        className="vtex-spinner_circle"
        cx={50}
        cy={50} fill="none"
        r={40}
        stroke="currentColor"
        strokeWidth={10}
        strokeDasharray="0 0 163.36281798666926 251.32741228718345"
        strokeLinecap="round"
        strokeDashoffset={1} />
    </svg>
  );
};

export default LoadingSpinner;
