import { IconType } from "react-icons";

export interface CardDataI {
  [key: string]: {
    title: string;
    value: number;
    icon: any;
    link: string;
    colorScheme:string
  };
}
export interface CardPropsI {
  title: string;
  value: number;
  link: string;
  loading?: boolean;
  icon: IconType;
}
