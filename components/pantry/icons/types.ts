export type SvgIconProps = {
  className?: string;
  color?: string;
} & (
  | {
      size?: string | number;
      height?: never;
      width?: never;
    }
  | {
      size?: never;
      height?: string | number;
      width?: string | number;
    }
);

export interface SvgIconComponent extends React.FunctionComponent<SvgIconProps> {}
