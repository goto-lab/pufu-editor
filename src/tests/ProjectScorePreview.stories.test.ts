import { expect, userEvent, waitFor, within } from "@storybook/test";
import { getScoreJson } from "../components/ProjectScore";
import { MeasureModel, ProjectScoreModel } from "../lib/models";
import { createInitialScoreDataWithComment } from "./common";

export const createPreviewRegressionScore = (): ProjectScoreModel => {
  const score = createInitialScoreDataWithComment();
  const measure: MeasureModel = {
    uuid: "original",
    text: "ヒアリング",
    color: "white",
    progress: 25,
    comment: { text: "観点A", color: "blue" },
  };
  const unsetProgress: MeasureModel = {
    ...measure,
    uuid: "unset-progress",
    text: "進捗未設定と0%",
    progress: undefined,
  };
  score.purposes = [
    {
      ...score.purposes[0],
      uuid: "purpose-a",
      measures: [
        measure,
        { ...measure, uuid: "same-purpose-duplicate" },
        { ...measure, uuid: "individual", text: "個別施策" },
        unsetProgress,
        { ...measure, uuid: "empty-a", text: "" },
      ],
    },
    {
      ...score.purposes[0],
      uuid: "purpose-b",
      text: "中間目的B",
      measures: [
        {
          ...measure,
          uuid: "different-feedback",
          progress: 75,
          comment: { text: "観点B", color: "blue" },
        },
        { ...measure, uuid: "different-color", color: "red" },
        { ...measure, uuid: "different-progress", progress: 50 },
        {
          ...measure,
          uuid: "different-comment",
          comment: { ...measure.comment, text: "観点C" },
        },
        {
          ...measure,
          uuid: "different-comment-color",
          comment: { ...measure.comment, color: "green" },
        },
        { ...measure, uuid: "shared" },
        { ...unsetProgress, uuid: "zero-progress", progress: 0 },
        { ...measure, uuid: "empty-b", text: "" },
      ],
    },
  ];
  return score;
};

export const previewRegressionTest = async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const canvas = within(canvasElement);
  const score = await canvas.findByRole("score", { name: "box" });
  const scoreKey = score.id.slice("score-".length);
  const saved = JSON.parse(getScoreJson(scoreKey)!);
  const hidden = new Set(["same-purpose-duplicate", "shared"]);

  await waitFor(() => {
    expect(within(score).getAllByRole("measure", { name: "box" })).toHaveLength(
      11,
    );
  });
  for (const purpose of saved.purposes as ProjectScoreModel["purposes"]) {
    for (const measure of purpose.measures) {
      const card = score.querySelector(
        `[id="${scoreKey}-measure-${measure.uuid}"][role="measure"]`,
      );
      if (hidden.has(measure.uuid)) {
        expect(card).toBeNull();
        continue;
      }
      expect(card).toBeInTheDocument();
      expect(
        within(card as HTMLElement).getByRole("measure", { name: "textbox" }),
      ).toHaveValue(measure.text);
      const wrapper = card!.parentElement!;
      expect(
        within(wrapper).getByRole("measure-comment", { name: "textbox" }),
      ).toHaveValue(measure.comment.text);
      if (measure.progress !== undefined) {
        expect(
          within(card as HTMLElement).getByText(`${measure.progress}%`),
        ).toBeVisible();
      }
    }
  }

  // 廟算八要素と振り返りを含め、表示中の全入力が読み取り専用。
  const textboxes = score.querySelectorAll<HTMLTextAreaElement>("textarea");
  for (const textbox of textboxes) {
    expect(textbox).toHaveAttribute("readonly");
  }
  expect(
    within(score).getAllByRole("element", { name: /-textbox$/ }),
  ).toHaveLength(8);
  expect(
    within(score).getByRole("people-comment", { name: "textbox" }),
  ).toHaveValue("ひとのコメント");
  expect(score.querySelector("input")).toBeNull();
  expect(within(score).queryByRole("measure", { name: "add-icon" })).toBeNull();

  await userEvent.type(
    within(score).getByRole("element", { name: "people-textbox" }),
    "変更されない",
  );
  await userEvent.type(
    within(score).getByRole("people-comment", { name: "textbox" }),
    "変更されない",
  );
  expect(JSON.parse(getScoreJson(scoreKey)!)).toEqual(saved);

  // 切り替えでも保存データを変更せず、編集モードでは全施策を表示する。
  const toggle = canvas.getByRole("button", { name: "プレビュー切り替え" });
  await userEvent.click(toggle);
  expect(within(score).getAllByRole("measure", { name: "box" })).toHaveLength(
    13,
  );
  for (const textbox of score.querySelectorAll("textarea, input")) {
    expect(textbox).not.toHaveAttribute("readonly");
  }
  expect(
    within(score).getAllByRole("measure", { name: "add-icon" }),
  ).toHaveLength(2);
  await userEvent.click(toggle);
  await waitFor(() => {
    expect(within(score).getAllByRole("measure", { name: "box" })).toHaveLength(
      11,
    );
  });
  expect(JSON.parse(getScoreJson(scoreKey)!)).toEqual(saved);
};
