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
