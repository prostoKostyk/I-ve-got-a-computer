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
  _version?: number;
}

export interface Group {
  subGroups: SubGroup[];
  group: string;
  groupName?: string;
  open?: boolean;
}
export interface GroupInput {
  group: string;
}

export interface SubGroupInput {
  subGroup: string;
  parentGroup: string;
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

export interface AddArticleInput {
  newArticle: Article,
  newGroup: string,
  newSubGroup: string
}

export interface HarmonicaNotes {
  _id?: string,
  tabs: string,
  title?: string
}

export interface Monitoring {
  id: string,
  name: string,
  url: string,
  value: string
  date: string
}
