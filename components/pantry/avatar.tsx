import React from "react";
import styles from "./avatar.module.css";

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

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarColor =
  | "aqua" | "blue" | "fuchsia" | "grape" | "lime"
  | "magenta" | "orange" | "white" | "yellow";

type InitialsAvatarProps = { type: "initials"; initials: string };
type IconAvatarProps = { type: "icon"; icon: React.ReactNode };
type ImageAvatarProps = { type: "image"; image: string };

export type AvatarProps = {
  color?: AvatarColor;
  entityType?: "human" | "thing";
  size?: AvatarSize;
  title?: string;
} & (InitialsAvatarProps | IconAvatarProps | ImageAvatarProps);

const avatarSizeCssMapper: Record<AvatarSize, string> = {
  xs: styles.xs, sm: styles.sm, md: styles.md, lg: styles.lg, xl: styles.xl,
};

const avatarColorCssMapper: Record<AvatarColor, string> = {
  aqua: styles.aqua, fuchsia: styles.fuchsia, grape: styles.grape,
  lime: styles.lime, magenta: styles.magenta, blue: styles.blue,
  orange: styles.orange, white: styles.white, yellow: styles.yellow,
};

const entityTypeCssMapper: Record<"human" | "thing", string> = {
  human: styles.human, thing: styles.thing,
};

function toNormalizedInitials(str: string): string {
  return str.slice(0, 2).toUpperCase();
}

const Avatar = ({ entityType = "human", size = "md", color = "white", ...props }: AvatarProps) => {
  function renderContent() {
    switch (props.type) {
      case "icon":
        return <span className={styles.icon}>{props.icon}</span>;
      case "initials":
        return toNormalizedInitials(props.initials);
      case "image":
        return <figure className={styles.image} style={{ backgroundImage: `url(${props.image})` }} />;
    }
  }

  return (
    <div
      className={cs(
        styles.avatar,
        avatarSizeCssMapper[size],
        props.type !== "image" && avatarColorCssMapper[color],
        entityTypeCssMapper[entityType]
      )}
      title={props.title}
    >
      {renderContent()}
    </div>
  );
};

Avatar.displayName = "Avatar";

export { Avatar };
