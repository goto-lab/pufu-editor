import { within, userEvent, expect } from "@storybook/test";

interface StorybookTestProps {
  canvasElement: HTMLElement;
}

export const blueTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const box = await canvas.findByRole("comment", { name: "box" });
  expect(box).toBeInTheDocument();

  expect(canvas.queryByRole("icon", { name: "pallette" })).toBeNull();
  expect(canvas.queryByRole("icon", { name: "blue" })).toBeNull();
  expect(canvas.queryByRole("icon", { name: "green" })).toBeNull();
  expect(canvas.queryByRole("icon", { name: "red" })).toBeNull();
  expect(
    await canvas.findByPlaceholderText("コメントを入力")
  ).toBeInTheDocument();

  const textbox = await canvas.findByRole("comment", { name: "textbox" });
  await userEvent.click(textbox);

  await userEvent.type(textbox, "サンプルテキストです");
  expect(
    await canvas.findByDisplayValue("サンプルテキストです")
  ).toBeInTheDocument();

  const pallette = await canvas.findByRole("comment", {
    name: "palette-icon",
  });
  await userEvent.click(pallette);

  const green = await canvas.findByRole("comment", {
    name: "color-icon-green",
  });
  await userEvent.click(green);
  expect(box).toHaveClass(/green/);
  expect(box).not.toHaveClass(/red/);
  expect(box).not.toHaveClass(/blue/);

  const red = await canvas.findByRole("comment", {
    name: "color-icon-red",
  });
  await userEvent.click(red);
  expect(box).not.toHaveClass(/green/);
  expect(box).toHaveClass(/red/);
  expect(box).not.toHaveClass(/blue/);

  const blue = await canvas.findByRole("comment", {
    name: "color-icon-blue",
  });
  await userEvent.click(blue);
  expect(box).not.toHaveClass(/green/);
  expect(box).not.toHaveClass(/red/);
  expect(box).toHaveClass(/blue/);
};

export const previewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);
  const box = await canvas.findByRole("comment", { name: "box" });
  expect(box).toBeInTheDocument();
  const textbox = await canvas.findByRole("comment", { name: "textbox" });
  expect(textbox).toBeInTheDocument();
  await canvas.findByDisplayValue("サンプルテキストです");
  expect(textbox).toHaveAttribute("readonly");
};
