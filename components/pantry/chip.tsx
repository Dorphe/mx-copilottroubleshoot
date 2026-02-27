import React from "react";
import styles from "./chip.module.css";

function cs(...args: (string | [string, boolean | undefined | null] | undefined | null | false)[]): string {
  return args
    .map((a) => {
      if (!a) return "";
      if (Array.isArray(a)) return a[1] ? a[0] : "";
      return a;
    })
    .filter(Boolean)
    .join(" ");
}

export type ChipSize = "small" | "medium" | "large";

export interface ChipProps {
  children?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  media?: React.ReactNode;
  size?: ChipSize;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const sizeToClass: Record<ChipSize, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

export function Chip({
  children,
  isDisabled,
  isSelected,
  media,
  size = "medium",
  onClick,
}: ChipProps) {
  const classNames = cs(
    styles.root,
    sizeToClass[size],
    [styles.isClickable, !!onClick],
    [styles.isSelected, isSelected],
    [styles.isDisabled, isDisabled]
  );

  if (onClick) {
    return (
      <button
        className={classNames}
        disabled={isDisabled}
        type="button"
        onClick={onClick}
      >
        {media ? <div className={styles.media}>{media}</div> : null}
        {children ? <div className={styles.text}>{children}</div> : null}
      </button>
    );
  }

  return (
    <div className={classNames}>
      {media ? <div className={styles.media}>{media}</div> : null}
      {children ? <div className={styles.text}>{children}</div> : null}
    </div>
  );
}

Chip.displayName = "Chip";
