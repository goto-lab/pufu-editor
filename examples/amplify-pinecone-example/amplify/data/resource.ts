import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const ProjectModel = a
  .model({
    title: a.string().required(),
  })
  .authorization((allow) => [allow.owner()]);

const CommentType = a.customType({
  color: a.enum(["blue", "green", "red"]),
  text: a.string(),
});

const MeasureType = a.customType({
  uuid: a.string(),
  text: a.string(),
  color: a.enum(["white", "blue", "green", "red", "yellow"]),
  comment: a.ref("Comment"),
});

const ObjectiveType = a.customType({
  uuid: a.string(),
  text: a.string(),
  comment: a.ref("Comment"),
});

const PurposeType = a.customType({
  uuid: a.string(),
  text: a.string(),
  comment: a.ref("Comment"),
  measures: a.ref("Measure").array(),
});

const ElementType = a.customType({
  uuid: a.string(),
  text: a.string(),
  comment: a.ref("Comment"),
});

const ElementsType = a.customType({
  people: a.ref("Element"),
  money: a.ref("Element"),
  time: a.ref("Element"),
  quality: a.ref("Element"),
  businessScheme: a.ref("Element"),
  environment: a.ref("Element"),
  rival: a.ref("Element"),
  foreignEnemy: a.ref("Element"),
});

const ScoreModel = a
  .model({
    projectId: a.id().required(),
    number: a.integer().required(),
    gainingGoal: a.ref("Objective").required(),
    winCondition: a.ref("Objective").required(),
    elements: a.ref("Elements").required(),
    purposes: a.ref("Purpose").array(),
    owner: a.id(),
  })
  .secondaryIndexes((index) => [
    index("projectId").sortKeys(["number"]).queryField("listByProjectId"),
  ])
  .authorization((allow) => [allow.owner()]);

const schema = a.schema({
  Project: ProjectModel,
  Score: ScoreModel,
  Comment: CommentType,
  Measure: MeasureType,
  Objective: ObjectiveType,
  Purpose: PurposeType,
  Element: ElementType,
  Elements: ElementsType,
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
