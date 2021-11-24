import React from "react";
import styles from "./css/contained-button.module.css";
import LoadingSpinner from "./LoadingSpinner";

type ContainedButtonProps = {
  children: React.ReactNode,
  disabled?: boolean,
  loading: boolean,
  block?: boolean,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  icon?: React.ReactNode
}

function ContainedButton({
  icon,
  block = false,
  loading = false,
  disabled = false,
  onClick = () => {},
  children,
}: ContainedButtonProps) {
  return (
    <button
      className={`${styles.containedBtn} ${block ? styles.block : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <LoadingSpinner /> : icon} <span className={styles.text}>{children}</span>
    </button>
  );
}

export default ContainedButton;


