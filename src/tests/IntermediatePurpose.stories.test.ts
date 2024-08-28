import { within, userEvent, expect } from "@storybook/test";

interface StorybookTestProps {
  canvasElement: HTMLElement;
}

export const editTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(
    await canvas.findByRole("purpose", { name: "box" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByPlaceholderText("中間目的を入力")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  await expect(textbox).toHaveClass("text-sm");
  await userEvent.click(textbox);
  expect(
    await canvas.findByRole("purpose", { name: "delete-icon" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByRole("purpose", { name: "up-icon" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByRole("purpose", { name: "down-icon" })
  ).toBeInTheDocument();

  await userEvent.type(textbox, "サンプルテキストです");
  expect(
    await canvas.findByDisplayValue("サンプルテキストです")
  ).toBeInTheDocument();
};

export const topTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(
    await canvas.findByRole("purpose", { name: "box" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByDisplayValue("サンプルテキストです。")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  expect(textbox).toBeInTheDocument();
  expect(canvas.queryByRole("purpose", { name: "closee-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();

  await userEvent.click(textbox);

  expect(
    await canvas.findByRole("purpose", { name: "delete-icon" })
  ).toBeInTheDocument();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(
    await canvas.findByRole("purpose", { name: "down-icon" })
  ).toBeInTheDocument();
};

export const bottomTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(
    await canvas.findByRole("purpose", { name: "box" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByDisplayValue("サンプルテキストです。")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  expect(textbox).toBeInTheDocument();
  expect(canvas.queryByRole("purpose", { name: "delete-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();
  expect(
    await canvas.findByRole("purpose", { name: "add-icon" })
  ).toBeInTheDocument();

  await userEvent.click(textbox);

  expect(
    await canvas.findByRole("purpose", { name: "delete-icon" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByRole("purpose", { name: "up-icon" })
  ).toBeInTheDocument();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();
  expect(
    await canvas.findByRole("purpose", { name: "add-icon" })
  ).toBeInTheDocument();
};

export const feedbackTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(
    await canvas.findByRole("purpose", { name: "box" })
  ).toBeInTheDocument();
  expect(
    await canvas.findByDisplayValue("サンプルテキストです。")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  expect(textbox).toBeInTheDocument();
  expect(canvas.queryByRole("purpose", { name: "delete-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();
  expect(
    await canvas.findByRole("purpose", { name: "add-icon" })
  ).toBeInTheDocument();

  await userEvent.click(textbox);

  expect(
    await canvas.findByRole("purpose", { name: "delete-icon" })
  ).toBeInTheDocument();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();
  expect(
    await canvas.findByRole("purpose", { name: "add-icon" })
  ).toBeInTheDocument();

  const commentIcon = await canvas.findByRole("purpose", {
    name: "comment-icon",
  });
  await userEvent.click(commentIcon);

  const commentArea = await canvas.findByRole("purpose", {
    name: "comment",
  });
  expect(commentArea).toBeInTheDocument();
  const commentTexbox = await canvas.findByRole("purpose-comment", {
    name: `textbox`,
  });
  await userEvent.type(commentTexbox, "中間目的のコメント");
  expect(await canvas.findByDisplayValue("中間目的のコメント"));

  const commentBox = await canvas.findByRole("purpose-comment", {
    name: "box",
  });
  const pallette = await canvas.findByRole("purpose-comment", {
    name: "palette-icon",
  });
  await userEvent.click(pallette);
  const green = await canvas.findByRole("purpose-comment", {
    name: "color-icon-green",
  });
  await userEvent.click(green);
  expect(commentBox).toHaveClass(/green/);
  expect(commentBox).not.toHaveClass(/red/);
  expect(commentBox).not.toHaveClass(/blue/);
  const red = await canvas.findByRole("purpose-comment", {
    name: "color-icon-red",
  });
  expect(red).toBeInTheDocument;
  await userEvent.click(red);
  expect(commentBox).not.toHaveClass(/green/);
  expect(commentBox).toHaveClass(/red/);
  expect(commentBox).not.toHaveClass(/blue/);

  const blue = await canvas.findByRole("purpose-comment", {
    name: "color-icon-blue",
  });
  await userEvent.click(blue);
  expect(commentBox).not.toHaveClass(/green/);
  expect(commentBox).not.toHaveClass(/red/);
  expect(commentBox).toHaveClass(/blue/);
};

export const previewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByRole("purpose", { name: "box" }));

  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  expect(textbox).toHaveAttribute("readonly");
  expect(await canvas.findByDisplayValue("サンプルテキストです。"));

  expect(canvas.queryByRole("purpose", { name: "closee-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "add-icon" })).toBeNull();
  await userEvent.click(textbox);
  expect(canvas.queryByRole("purpose", { name: "closee-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "up-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "down-icon" })).toBeNull();
  expect(canvas.queryByRole("purpose", { name: "add-icon" })).toBeNull();

  const commentTexbox = await canvas.findByRole("purpose-comment", {
    name: "textbox",
  });
  expect(commentTexbox).toHaveAttribute("readonly");
  expect(await canvas.findByDisplayValue("コメントのテキストです。"));
};

export const textBaseTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);
  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  await expect(textbox).not.toHaveClass("text-sm");
  await expect(textbox).toHaveClass("text-base");
  await expect(textbox).not.toHaveClass("text-lg");
};

export const textLargeTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);
  const textbox = await canvas.findByRole("purpose", { name: "textbox" });
  await expect(textbox).not.toHaveClass("text-sm");
  await expect(textbox).not.toHaveClass("text-base");
  await expect(textbox).toHaveClass("text-lg");
};
