import { EventHandler } from "@create-figma-plugin/utilities";

export interface CreateRectanglesHandler extends EventHandler {
  name: "CREATE_RECTANGLES";
  handler: (count: number) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}
export const ThicknessMap = {
  bold: "bold",
  medium: "medium",
  regular: "regular",
  light: "light",
} as const;

export type Thickness = typeof ThicknessMap[keyof typeof ThicknessMap];

export const StyleMap = {
  fill: "fill",
  stroke: "stroke"
} as const;

export type Style = typeof StyleMap[keyof typeof StyleMap];

export interface Iconoteka {
  iconoteka: RootCategory;
}
export interface RootCategory {
  name: "iconoteka";
  items: IconCategory[];
}
export interface IconProperties {
  isFill: boolean;
  isStroke: boolean;
  isBold: boolean;
  isMedium: boolean;
  isRegular: boolean;
  isLight: boolean;
}

export interface IconItem {
  properties: IconProperties;
  name: string;
  keywords: string[];
  path: string;
  groupName?: string;
}

export interface IconCategory {
  name: string;
  items: IconItem[];
}

export interface IconSet {
  iconoteka: {
    name: string;
    items: IconCategory[];
  };
}
