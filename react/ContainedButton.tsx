import React from "react";
import LoadingSpinner from "./LoadingSpinner";

import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['containedButton','containedButtonBlock','containedButtonText','containedButtonLoader',] as const


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

  const handles = useCssHandles(CSS_HANDLES)


  return (
    <button
      className={`${handles.containedButton}  ${block ? handles.containedButtonBlock : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <LoadingSpinner /> : icon} <span className={handles.containedButtonText} >{children}</span>
    </button>
  );
}

export default ContainedButton;


