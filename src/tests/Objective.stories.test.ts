import { within, userEvent, expect } from "@storybook/test";

interface StorybookTestProps {
  canvasElement: HTMLElement;
}

export const gainingGoalTest = async ({
  canvasElement,
}: StorybookTestProps) => {
  const canvas = within(canvasElement);
  expect(
    await canvas.findByRole("gaining-goal", { name: "box" })
  ).toBeInTheDocument();

  expect(
    await canvas.findByRole("gaining-goal", { name: "box" })
  ).toBeInTheDocument();
  expect(await canvas.findByText(/^獲得目標$/)).toBeInTheDocument();
  expect(
    await canvas.findByPlaceholderText("獲得目標を入力")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("gaining-goal", {
    name: "textbox",
  });
  await userEvent.type(textbox, "獲得目標のテキスト");
  canvas.findAllByDisplayValue("獲得目標のテキスト");
};

export const winConditionTest = async ({
  canvasElement,
}: StorybookTestProps) => {
  const canvas = within(canvasElement);
  expect(
    await canvas.findByRole("win-condition", { name: "box" })
  ).toBeInTheDocument();
  expect(await canvas.findByText(/^勝利条件$/)).toBeInTheDocument();
  expect(
    await canvas.findByPlaceholderText("勝利条件を入力")
  ).toBeInTheDocument();
  const textbox = await canvas.findByRole("win-condition", {
    name: "textbox",
  });
  await userEvent.type(textbox, "勝利条件のテキスト");
  canvas.findAllByDisplayValue("勝利条件のテキスト");
};

export const feedbackTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(
    await canvas.findByRole("win-condition", { name: "box" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByDisplayValue("サンプルテキストです。")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("win-condition", {
    name: "textbox",
  });
  await userEvent.click(textbox);

  const commentIcon = await canvas.findByRole("win-condition", {
    name: "comment-icon",
  });
  await userEvent.click(commentIcon);

  const commentArea = await canvas.findByRole("win-condition", {
    name: "comment",
  });
  expect(commentArea).toBeInTheDocument();
  const commentTexbox = await canvas.findByRole("win-condition-comment", {
    name: `textbox`,
  });
  await userEvent.type(commentTexbox, "勝利条件のコメント");
  expect(await canvas.findByDisplayValue("勝利条件のコメント"));

  const commentBox = await canvas.findByRole("win-condition-comment", {
    name: "box",
  });
  const pallette = await canvas.findByRole("win-condition-comment", {
    name: "palette-icon",
  });
  await userEvent.click(pallette);
  const green = await canvas.findByRole("win-condition-comment", {
    name: "color-icon-green",
  });
  await userEvent.click(green);
  expect(commentBox).toHaveClass(/green/);
  expect(commentBox).not.toHaveClass(/red/);
  expect(commentBox).not.toHaveClass(/blue/);
  const red = await canvas.findByRole("win-condition-comment", {
    name: "color-icon-red",
  });
  expect(red).toBeInTheDocument;
  await userEvent.click(red);
  expect(commentBox).not.toHaveClass(/green/);
  expect(commentBox).toHaveClass(/red/);
  expect(commentBox).not.toHaveClass(/blue/);

  const blue = await canvas.findByRole("win-condition-comment", {
    name: "color-icon-blue",
  });
  await userEvent.click(blue);
  expect(commentBox).not.toHaveClass(/green/);
  expect(commentBox).not.toHaveClass(/red/);
  expect(commentBox).toHaveClass(/blue/);
};

export const previewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByRole("win-condition", { name: "box" }));

  const textbox = await canvas.findByRole("win-condition", {
    name: "textbox",
  });
  expect(textbox).toHaveAttribute("readonly");
  expect(await canvas.findByDisplayValue("サンプルテキストです。"));

  const commentTexbox = await canvas.findByRole("win-condition-comment", {
    name: "textbox",
  });
  expect(commentTexbox).toHaveAttribute("readonly");
  expect(await canvas.findByDisplayValue("コメントのテキストです。"));
};
