export interface MyIconsProperties {
  name: NameIcon;
  size: number;
  className?: string;
}

export type NameIcon =
  | "database"
  | "activity"
  | "layers"
  | "globe"
  | "send"
  | "barChart"
  | "email"
  | "password"
  | "play"
  | "repair";
