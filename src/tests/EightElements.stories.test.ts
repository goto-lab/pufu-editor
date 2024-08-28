import { within, userEvent, expect } from "@storybook/test";

interface StorybookTestProps {
  canvasElement: HTMLElement;
}

export const editTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const labels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(labels)) {
    const box = await canvas.findByRole("element", { name: key });
    expect(box).toBeInTheDocument();
    expect(await canvas.findByText(labels[key])).toBeInTheDocument();
    expect(
      await canvas.findByPlaceholderText(`${labels[key]}を入力`)
    ).toBeInTheDocument();
    const textBox = await canvas.findByRole("element", {
      name: `${key}-textbox`,
    });
    await expect(textBox).toHaveClass("text-sm");
    await userEvent.type(textBox, `${labels[key]}のテキスト`);
    expect(
      await canvas.findByDisplayValue(`${labels[key]}のテキスト`)
    ).toBeInTheDocument();
  }
};

export const feedbackTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const labels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(labels)) {
    const commentIcon = await canvas.findByRole("element", {
      name: `comment-icon-${key}`,
    });
    await userEvent.click(commentIcon);
    const commentArea = await canvas.findByRole("element", {
      name: `comment-${key}`,
    });
    expect(commentArea).toBeInTheDocument();
    const commentTexbox = await canvas.findByRole(`${key}-comment`, {
      name: `textbox`,
    });
    await userEvent.type(commentTexbox, `${labels[key]}のコメント`);
    expect(await canvas.findByDisplayValue(`${labels[key]}のコメント`));

    const commentBox = await canvas.findByRole(`${key}-comment`, {
      name: "box",
    });
    await userEvent.click(commentBox);
    const pallette = await canvas.findByRole(`${key}-comment`, {
      name: "palette-icon",
    });
    await userEvent.click(pallette);
    if (key === "people") {
      const green = await canvas.findByRole(`${key}-comment`, {
        name: "color-icon-green",
      });
      await userEvent.click(green);
      expect(commentBox).toHaveClass(/green/);
      expect(commentBox).not.toHaveClass(/red/);
      expect(commentBox).not.toHaveClass(/blue/);
    } else if (key === "money") {
      const red = await canvas.findByRole(`${key}-comment`, {
        name: "color-icon-red",
      });
      await userEvent.click(red);
      expect(commentBox).not.toHaveClass(/green/);
      expect(commentBox).toHaveClass(/red/);
      expect(commentBox).not.toHaveClass(/blue/);
    } else {
      const blue = await canvas.findByRole(`${key}-comment`, {
        name: "color-icon-blue",
      });
      expect(blue).toBeInTheDocument;
      expect(commentBox).not.toHaveClass(/green/);
      expect(commentBox).not.toHaveClass(/red/);
      expect(commentBox).toHaveClass(/blue/);
    }
  }
};

export const previewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const labels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(labels)) {
    const textBox = await canvas.findByRole("element", {
      name: `${key}-textbox`,
    });
    expect(textBox).toHaveAttribute("readonly");
    expect(await canvas.findByDisplayValue(`${labels[key]}のテキスト`));

    const commentTexbox = await canvas.findByRole(`${key}-comment`, {
      name: `textbox`,
    });
    expect(commentTexbox).toHaveAttribute("readonly");
    expect(await canvas.findByDisplayValue(`${labels[key]}のコメント`));
  }
};

export const TextBaseTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const labels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(labels)) {
    const textbox = await canvas.findByRole("element", {
      name: `${key}-textbox`,
    });
    await expect(textbox).not.toHaveClass("text-sm");
    await expect(textbox).toHaveClass("text-base");
    await expect(textbox).not.toHaveClass("text-lg");
  }
};

export const TextLargeTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const labels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(labels)) {
    const textbox = await canvas.findByRole("element", {
      name: `${key}-textbox`,
    });
    await expect(textbox).not.toHaveClass("text-sm");
    await expect(textbox).not.toHaveClass("text-base");
    await expect(textbox).toHaveClass("text-lg");
  }
};
