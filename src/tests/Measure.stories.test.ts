import { within, userEvent, expect } from "@storybook/test";

interface StorybookTestProps {
  canvasElement: HTMLElement;
}

export const whiteTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);
  const box = await canvas.findByRole("measure", { name: "box" });

  expect(
    await canvas.findByRole("measure", { name: "box" })
  ).toBeInTheDocument();
  expect(await canvas.findByPlaceholderText("施策を入力")).toBeInTheDocument();

  expect(canvas.queryByRole("measure", { name: "delete-icon" })).toBeNull();
  expect(canvas.queryByRole("measure", { name: "palette-icon" })).toBeNull();
  const textbox = await canvas.findByRole("measure", { name: "textbox" });
  await expect(textbox).toHaveClass("text-sm");
  await userEvent.click(textbox);
  expect(
    await canvas.findByRole("measure", { name: "delete-icon" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByRole("measure", { name: "palette-icon" })
  ).toBeInTheDocument();

  await userEvent.type(textbox, "サンプルテキストです");
  expect(
    await canvas.findByDisplayValue("サンプルテキストです")
  ).toBeInTheDocument();

  const pallette = await canvas.findByRole("measure", {
    name: "palette-icon",
  });
  await userEvent.click(pallette);

  const green = await canvas.findByRole("measure", {
    name: "color-icon-green",
  });
  await userEvent.click(green);
  expect(box).toHaveClass(/green/);
  expect(box).not.toHaveClass(/red/);
  expect(box).not.toHaveClass(/sky/);
  expect(box).not.toHaveClass(/gray/);

  const red = await canvas.findByRole("measure", {
    name: "color-icon-red",
  });
  await userEvent.click(red);
  expect(box).not.toHaveClass(/green/);
  expect(box).toHaveClass(/red/);
  expect(box).not.toHaveClass(/sky/);
  expect(box).not.toHaveClass(/gray/);

  const blue = await canvas.findByRole("measure", {
    name: "color-icon-blue",
  });
  await userEvent.click(blue);
  expect(box).not.toHaveClass(/green/);
  expect(box).not.toHaveClass(/red/);
  expect(box).toHaveClass(/sky/);
  expect(box).not.toHaveClass(/gray/);

  const white = await canvas.findByRole("measure", {
    name: "color-icon-white",
  });
  await userEvent.click(white);
  expect(box).not.toHaveClass(/green/);
  expect(box).not.toHaveClass(/red/);
  expect(box).not.toHaveClass(/sky/);
  expect(box).toHaveClass(/gray/);
};

export const feedbackTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(
    await canvas.findByRole("measure", { name: "box" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByDisplayValue("サンプルテキストです。")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("measure", { name: "textbox" });
  expect(textbox).toBeInTheDocument();
  expect(canvas.queryByRole("measure", { name: "delete-icon" })).toBeNull();
  expect(canvas.queryByRole("measure", { name: "palette-icon" })).toBeNull();

  await userEvent.click(textbox);

  expect(
    await canvas.findByRole("measure", { name: "delete-icon" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByRole("measure", { name: "palette-icon" })
  ).toBeInTheDocument();

  const commentIcon = await canvas.findByRole("measure", {
    name: "comment-icon",
  });
  await userEvent.click(commentIcon);

  const commentArea = await canvas.findByRole("measure", {
    name: "comment",
  });
  expect(commentArea).toBeInTheDocument();
  const commentTexbox = await canvas.findByRole("measure-comment", {
    name: `textbox`,
  });
  await userEvent.type(commentTexbox, "施策のコメント");
  expect(await canvas.findByDisplayValue("施策のコメント"));

  const commentBox = await canvas.findByRole("measure-comment", {
    name: "box",
  });
  const pallette = await canvas.findByRole("measure-comment", {
    name: "palette-icon",
  });
  await userEvent.click(pallette);
  const green = await canvas.findByRole("measure-comment", {
    name: "color-icon-green",
  });
  await userEvent.click(green);
  expect(commentBox).toHaveClass(/green/);
  expect(commentBox).not.toHaveClass(/red/);
  expect(commentBox).not.toHaveClass(/blue/);
  const red = await canvas.findByRole("measure-comment", {
    name: "color-icon-red",
  });
  expect(red).toBeInTheDocument;
  await userEvent.click(red);
  expect(commentBox).not.toHaveClass(/green/);
  expect(commentBox).toHaveClass(/red/);
  expect(commentBox).not.toHaveClass(/blue/);

  const blue = await canvas.findByRole("measure-comment", {
    name: "color-icon-blue",
  });
  await userEvent.click(blue);
  expect(commentBox).not.toHaveClass(/green/);
  expect(commentBox).not.toHaveClass(/red/);
  expect(commentBox).toHaveClass(/blue/);
};

export const previewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByRole("measure", { name: "box" }));

  const textbox = await canvas.findByRole("measure", { name: "textbox" });
  expect(textbox).toHaveAttribute("readonly");
  expect(await canvas.findByDisplayValue("サンプルテキストです。"));

  expect(canvas.queryByRole("measure", { name: "closee-icon" })).toBeNull();
  expect(canvas.queryByRole("measure", { name: "palette-icon" })).toBeNull();
  await userEvent.click(textbox);
  expect(canvas.queryByRole("measure", { name: "closee-icon" })).toBeNull();
  expect(canvas.queryByRole("measure", { name: "palette-icon" })).toBeNull();

  const commentTexbox = await canvas.findByRole("measure-comment", {
    name: "textbox",
  });
  expect(commentTexbox).toHaveAttribute("readonly");
  expect(await canvas.findByDisplayValue("コメントのテキストです。"));
};

export const textBaseTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);
  const textbox = await canvas.findByRole("measure", { name: "textbox" });
  await expect(textbox).not.toHaveClass("text-sm");
  await expect(textbox).toHaveClass("text-base");
  await expect(textbox).not.toHaveClass("text-lg");
};

export const textLargeTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);
  const textbox = await canvas.findByRole("measure", { name: "textbox" });
  await expect(textbox).not.toHaveClass("text-sm");
  await expect(textbox).not.toHaveClass("text-base");
  await expect(textbox).toHaveClass("text-lg");
};

// 進捗インジケーター: 編集モードテスト
export const progressEditTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  // 施策ボックスが表示される
  expect(
    await canvas.findByRole("measure", { name: "box" })
  ).toBeInTheDocument();

  // 進捗編集エリアが表示される（showProgress=true）
  const progressEdit = await canvas.findByRole("measure", { name: "progress-edit" });
  expect(progressEdit).toBeInTheDocument();

  // 進捗ラベルが表示される
  expect(await canvas.findByText("進捗")).toBeInTheDocument();

  // 進捗入力欄に値が表示される
  const progressInput = await canvas.findByRole("measure", { name: "progress-input" });
  expect(progressInput).toBeInTheDocument();
  expect(progressInput).toHaveValue(60);

  // 値を変更できる
  await userEvent.clear(progressInput);
  await userEvent.type(progressInput, "80");
  expect(progressInput).toHaveValue(80);
};

// 進捗インジケーター: プレビューモードテスト
export const progressPreviewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  // 施策ボックスが表示される
  expect(
    await canvas.findByRole("measure", { name: "box" })
  ).toBeInTheDocument();

  // プレビューモードの進捗表示エリアが表示される
  const progressArea = await canvas.findByRole("measure", { name: "progress" });
  expect(progressArea).toBeInTheDocument();

  // 進捗ラベルが表示される
  expect(await canvas.findByText("進捗")).toBeInTheDocument();

  // パーセント表示がある
  expect(await canvas.findByText("80%")).toBeInTheDocument();

  // 編集用の入力欄は表示されない
  expect(canvas.queryByRole("measure", { name: "progress-input" })).toBeNull();

  // テキストは読み取り専用
  const textbox = await canvas.findByRole("measure", { name: "textbox" });
  expect(textbox).toHaveAttribute("readonly");
};
