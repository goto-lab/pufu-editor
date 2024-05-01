export type CommentColor = "blue" | "green" | "red";

export interface CommentModel {
  color: CommentColor;
  text: string;
}

export interface BaseModel {
  uuid: string;
  text: string;
  comment: CommentModel;
}

export type MeasureColor = "white" | "blue" | "green" | "red" | "yellow";

export interface MeasureModel extends BaseModel {
  id?: string;
  color: MeasureColor;
}

export interface SortableMeasureModel extends MeasureModel {
  id: string;
}

export interface IntermediatePurposeModel extends BaseModel {
  measures: MeasureModel[];
}

export type ObjectiveModel = BaseModel;

export type ObjectiveLabel = "WinCondition" | "GainingGoal";

export type ElementModel = BaseModel;

export interface EightElementsModel {
  people: ElementModel;
  money: ElementModel;
  time: ElementModel;
  quality: ElementModel;
  businessScheme: ElementModel;
  environment: ElementModel;
  rival: ElementModel;
  foreignEnemy: ElementModel;
}

export type ElementLabel =
  | "people"
  | "money"
  | "time"
  | "quality"
  | "businessScheme"
  | "environment"
  | "rival"
  | "foreignEnemy";

export interface ProjectScoreModel {
  gainingGoal: ObjectiveModel;
  winCondition: ObjectiveModel;
  purposes: IntermediatePurposeModel[];
  elements: EightElementsModel;
}

export interface ProjectScoreMap {
  [key: string]: ProjectScoreModel;
}

export type SupportLanguage = "ja" | "en";
