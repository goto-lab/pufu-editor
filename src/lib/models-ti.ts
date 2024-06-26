/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const CommentColor = t.union(t.lit("blue"), t.lit("green"), t.lit("red"));

export const CommentModel = t.iface([], {
  "color": "CommentColor",
  "text": "string",
});

export const BaseModel = t.iface([], {
  "uuid": "string",
  "text": "string",
  "comment": "CommentModel",
});

export const MeasureColor = t.union(t.lit("white"), t.lit("blue"), t.lit("green"), t.lit("red"), t.lit("yellow"));

export const MeasureModel = t.iface(["BaseModel"], {
  "id": t.opt("string"),
  "color": "MeasureColor",
});

export const SortableMeasureModel = t.iface(["MeasureModel"], {
  "id": "string",
});

export const IntermediatePurposeModel = t.iface(["BaseModel"], {
  "measures": t.array("MeasureModel"),
});

export const ObjectiveModel = t.name("BaseModel");

export const ObjectiveLabel = t.union(t.lit("WinCondition"), t.lit("GainingGoal"));

export const ElementModel = t.name("BaseModel");

export const EightElementsModel = t.iface([], {
  "people": "ElementModel",
  "money": "ElementModel",
  "time": "ElementModel",
  "quality": "ElementModel",
  "businessScheme": "ElementModel",
  "environment": "ElementModel",
  "rival": "ElementModel",
  "foreignEnemy": "ElementModel",
});

export const ElementLabel = t.union(t.lit("people"), t.lit("money"), t.lit("time"), t.lit("quality"), t.lit("businessScheme"), t.lit("environment"), t.lit("rival"), t.lit("foreignEnemy"));

export const ProjectScoreModel = t.iface([], {
  "gainingGoal": "ObjectiveModel",
  "winCondition": "ObjectiveModel",
  "purposes": t.array("IntermediatePurposeModel"),
  "elements": "EightElementsModel",
});

export const ProjectScoreMap = t.iface([], {
  [t.indexKey]: "ProjectScoreModel",
});

export const SupportLanguage = t.union(t.lit("ja"), t.lit("en"));

const exportedTypeSuite: t.ITypeSuite = {
  CommentColor,
  CommentModel,
  BaseModel,
  MeasureColor,
  MeasureModel,
  SortableMeasureModel,
  IntermediatePurposeModel,
  ObjectiveModel,
  ObjectiveLabel,
  ElementModel,
  EightElementsModel,
  ElementLabel,
  ProjectScoreModel,
  ProjectScoreMap,
  SupportLanguage,
};
export default exportedTypeSuite;
