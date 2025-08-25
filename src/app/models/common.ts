import {OBJECTS_TYPES} from "../constants/constants";

export interface User  {
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
  imageUrls?: string[];
  editing?: boolean;
}

export interface SubGroup {
  articles: Article[];
  group: string;
}

export interface Group {
  articles: Article[];
  group: string;
}
