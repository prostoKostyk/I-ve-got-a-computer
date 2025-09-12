import {OBJECTS_TYPES} from "../constants/constants";

export interface User {
  id?: number;
  _id?: number;
  name: string;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ObjectsItems {
  x: number;
  y: number;
  width: number;
  height: number;
  type: OBJECTS_TYPES
}

export interface Article {
  _id?: string;
  _created?: string;
  title: string;
  content: string;
  group: string;
  subGroup: string;
  imageUrls?: string;
  editing?: boolean;
  order: number;
  ignoreHtml: boolean;
  done?: boolean;
}

export function createEmptyArticle(): Article {
  return { title: '', content: '', group: '', subGroup: '', order: 999999999999999, ignoreHtml: false}
}

export interface Group {
  subGroups: SubGroup[];
  group: string;
  open?: boolean;
}

export interface SubGroup {
  articles: Article[];
  subGroup: string;
  parentGroup: string;
}

export interface DeleteGroupInput {
  group: Group | null,
  subGroup?: SubGroup
}
