import { BaseModel, MeasureModel, ProjectScoreModel } from "../lib/models";
import short from "short-uuid";
import { within, userEvent, expect } from "@storybook/test";

type CanvasType = ReturnType<typeof within>;

export const addPurpose = async (canvas: CanvasType, num: number) => {
  await userEvent.click(
    await canvas.findByRole("purpose", { name: "add-icon" })
  );
  const purposes = await canvas.findAllByRole("purpose", {
    name: "textbox",
  });
  expect(purposes.length).toBe(num);
  await userEvent.type(purposes[num - 1], `中間目的${num}テキスト`);
  expect(
    await canvas.findByDisplayValue(`中間目的${num}テキスト`)
  ).toBeInTheDocument();
};

export const addMeasure = async (canvas: CanvasType, num: number) => {
  await userEvent.click(
    await canvas.findByRole("measure", { name: "add-box" })
  );
  const measures = await canvas.findAllByRole("measure", {
    name: "textbox",
  });
  expect(measures.length).toBe(num);
  await userEvent.type(measures[num - 1], `施策${num}テキスト`);
  expect(
    await canvas.findByDisplayValue(`施策${num}テキスト`)
  ).toBeInTheDocument();
};

export const addMeasureByIcon = async (
  canvas: CanvasType,
  num: number,
  iconNum: number
) => {
  await userEvent.click(
    (await canvas.findAllByRole("measure", { name: "add-icon" }))[iconNum - 1]
  );
  const measures = await canvas.findAllByRole("measure", {
    name: "textbox",
  });
  expect(measures.length).toBe(num);
  await userEvent.type(measures[num - 1], `施策${num}テキスト`);
  expect(
    await canvas.findByDisplayValue(`施策${num}テキスト`)
  ).toBeInTheDocument();
};

export const getPurpose = async (canvas: CanvasType, num: number) => {
  return (
    await canvas.findAllByRole("purpose", {
      name: "textbox",
    })
  )[num - 1];
};

export const getPurposeCount = async (canvas: CanvasType) => {
  return (
    await canvas.findAllByRole("purpose", {
      name: "box",
    })
  ).length;
};

export const getMeasure = async (canvas: CanvasType, num: number) => {
  return (
    await canvas.findAllByRole("measure", {
      name: "textbox",
    })
  )[num - 1];
};

export const getMeasureCount = async (canvas: CanvasType) => {
  return (
    await canvas.findAllByRole("measure", {
      name: "textbox",
    })
  ).length;
};
export const createInitialScoreDataWithDuplication = () => {
  const score = createInitialScoreDataWithComment();
  score.purposes.push({
    ...defaultValueWithComment("中間目的"),
    measures: [
      defaultMeasureValueWithComment("施策3"),
      defaultMeasureValueWithComment("施策1"),
    ],
  });
  score.purposes.push({
    ...defaultValueWithComment("中間目的"),
    measures: [
      defaultMeasureValueWithComment("施策4"),
      defaultMeasureValueWithComment("施策1"),
    ],
  });
  return score;
};
export const createInitialScoreDataWithComment = () => {
  return {
    winCondition: defaultValueWithComment("勝利条件"),
    gainingGoal: defaultValueWithComment("獲得目標"),
    purposes: [
      {
        ...defaultValueWithComment("中間目的"),
        measures: [
          defaultMeasureValueWithComment("施策1"),
          defaultMeasureValueWithComment("施策2"),
        ],
      },
    ],
    elements: {
      people: defaultValueWithComment("ひと"),
      money: defaultValueWithComment("お金"),
      time: defaultValueWithComment("時間"),
      quality: defaultValueWithComment("クオリティ"),
      businessScheme: defaultValueWithComment("商流 / 座組"),
      environment: defaultValueWithComment("環境"),
      rival: defaultValueWithComment("ライバル"),
      foreignEnemy: defaultValueWithComment("外敵"),
    },
  } as ProjectScoreModel;
};

const defaultValueWithComment = (label: string) => {
  const value = {
    uuid: short.generate(),
    text: label,
    comment: {
      uuid: short.generate(),
      color: "blue",
      text: `${label}のコメント`,
    },
  } as BaseModel;
  return value;
};

const defaultMeasureValueWithComment = (label: string) => {
  const value = defaultValueWithComment(label) as MeasureModel;
  value.color = "white";
  return value;
};
