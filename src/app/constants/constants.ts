export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 640;

export enum PlayerStates {
  STANDING = 0,
  RUNNING = 1,
  JUMPING = 2,
  FALLING = 3,
}

export enum KEYS {
  ARROW_DOWN = "ArrowDown",
  ARROW_UP = "ArrowUp",
  ARROW_RIGHT = "ArrowRight",
  ARROW_LEFT = "ArrowLeft"
}

export enum OBJECTS_TYPES {
  COMPUTER =  "Computer"
}

export enum APP_CONDITION {
  LOGIN = "0a",
  GAME = "1a",
  COMPUTER_OPENED = "2a",
  COMPUTER_OPENED_ARTICLES = "2a1",
}

export enum ARTICLE_FORM_FIELDS {
  GROUP = "group",
  SUB_GROUP = "subGroup",
  CONTENT = "content",
}

export const NOT_DELETED_SECTIONS = ["Angular", "CSS"];
export const NOT_DELETED_SUBSECTIONS = ["Angular basic", "CSS Basic"];


