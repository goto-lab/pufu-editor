import { within, userEvent, expect } from "@storybook/test";
import {
  addMeasure,
  addMeasureByIcon,
  getMeasure,
  getMeasureCount,
  addPurpose,
  getPurpose,
  getPurposeCount,
} from "./common";

interface StorybookTestProps {
  canvasElement: HTMLElement;
}

export const editTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  expect(await canvas.findByRole("score", { name: "box" })).toBeInTheDocument();

  /* Input eight elements */
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
    expect(
      await canvas.findByText(new RegExp(`^${labels[key]}$`))
    ).toBeInTheDocument();
    expect(
      await canvas.findByPlaceholderText(`${labels[key]}を入力`)
    ).toBeInTheDocument();
    userEvent.type(
      await canvas.findByRole("element", { name: `${key}-textbox` }),
      `${labels[key]}テキスト`
    );
    expect(
      await canvas.findByDisplayValue(`${labels[key]}テキスト`)
    ).toBeInTheDocument();
  }

  /* Input win condition */
  expect(await canvas.findByText(/^勝利条件$/)).toBeInTheDocument();
  expect(
    await canvas.findByPlaceholderText("勝利条件を入力")
  ).toBeInTheDocument();
  await userEvent.type(
    await canvas.findByRole("win-condition", { name: "textbox" }),
    "勝利条件テキスト"
  );
  expect(
    await canvas.findByDisplayValue("勝利条件テキスト")
  ).toBeInTheDocument();

  /* Input gaining goal */
  expect(await canvas.findByText(/^獲得目標$/)).toBeInTheDocument();
  expect(
    await canvas.findByPlaceholderText("獲得目標を入力")
  ).toBeInTheDocument();
  await userEvent.type(
    await canvas.findByRole("gaining-goal", { name: "textbox" }),
    "獲得目標テキスト"
  );
  expect(
    await canvas.findByDisplayValue("獲得目標テキスト")
  ).toBeInTheDocument();

  /* Input intermediate purpose */
  expect(await canvas.findByText(/^中間目的$/)).toBeInTheDocument();
  expect(
    await canvas.findByPlaceholderText("中間目的を入力")
  ).toBeInTheDocument();
  expect(
    await canvas.findByRole("purpose", { name: "add-icon" })
  ).toBeInTheDocument();
  await userEvent.type(await getPurpose(canvas, 1), "中間目的1テキスト");
  expect(
    await canvas.findByDisplayValue("中間目的1テキスト")
  ).toBeInTheDocument();

  /* Input measure */
  expect(await canvas.findByText(/^施策$/)).toBeInTheDocument();
  expect((await canvas.findAllByPlaceholderText("施策を入力")).length).toBe(2);
  const measureTexboxes = await canvas.findAllByRole("measure", {
    name: "textbox",
  });
  expect(measureTexboxes.length).toBe(2);
  for (const i in measureTexboxes) {
    await userEvent.type(measureTexboxes[i], `施策${Number(i) + 1}テキスト`);
    expect(
      await canvas.findByDisplayValue(`施策${Number(i) + 1}テキスト`)
    ).toBeInTheDocument();
  }

  /* Add measure & purpose */
  expect(
    await canvas.findByRole("measure", { name: "add-icon" })
  ).toBeInTheDocument();

  await addPurpose(canvas, 2);
  await addMeasure(canvas, 3);

  await addPurpose(canvas, 3);
  await addMeasure(canvas, 4);

  await addPurpose(canvas, 4);
  await addMeasure(canvas, 5);
  await addMeasureByIcon(canvas, 6, 4);

  /* Swap purpose */
  await userEvent.click(await getPurpose(canvas, 4));
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "up-icon",
    })
  );
  expect(await getPurpose(canvas, 3)).toHaveTextContent("中間目的4テキスト");
  expect(await getPurpose(canvas, 4)).toHaveTextContent("中間目的3テキスト");
  await userEvent.click(await getPurpose(canvas, 3));
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "down-icon",
    })
  );
  expect(await getPurpose(canvas, 3)).toHaveTextContent("中間目的3テキスト");
  expect(await getPurpose(canvas, 4)).toHaveTextContent("中間目的4テキスト");

  /* Delete measure and purpose */
  expect(await getMeasureCount(canvas)).toBe(6);
  await userEvent.click(await getMeasure(canvas, 6));
  await userEvent.click(
    await canvas.findByRole("measure", {
      name: "delete-icon",
    })
  );
  expect(await getMeasureCount(canvas)).toBe(5);
  await userEvent.click(await getMeasure(canvas, 5));
  await userEvent.click(
    await canvas.findByRole("measure", {
      name: "delete-icon",
    })
  );
  expect(await getMeasureCount(canvas)).toBe(4);

  /* Empty measure and purpose */
  expect(await getPurposeCount(canvas)).toBe(4);
  await userEvent.click(await getPurpose(canvas, 4));
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "delete-icon",
    })
  );
  expect(await getPurposeCount(canvas)).toBe(3);
  await userEvent.click(await getPurpose(canvas, 3));
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "delete-icon",
    })
  );
  expect(await getPurposeCount(canvas)).toBe(2);
  await userEvent.click(await getPurpose(canvas, 2));
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "delete-icon",
    })
  );
  expect(await getPurposeCount(canvas)).toBe(1);
  await userEvent.click(await getPurpose(canvas, 1));
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "delete-icon",
    })
  );
  await userEvent.click(
    await canvas.findByRole("purpose", {
      name: "add-box",
    })
  );
  await userEvent.type(await getPurpose(canvas, 1), "中間目的1テキスト");
  await addMeasure(canvas, 1);
  await addMeasureByIcon(canvas, 2, 1);
};

export const feedbackTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const elementLabels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(elementLabels)) {
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
    await userEvent.type(commentTexbox, `${elementLabels[key]}のコメント`);
    expect(await canvas.findByDisplayValue(`${elementLabels[key]}のコメント`));

    const commentBox = await canvas.findByRole(`${key}-comment`, {
      name: "box",
    });
    await userEvent.click(commentBox);
    const pallette = await canvas.findByRole(`${key}-comment`, {
      name: "palette-icon",
    });
    await userEvent.click(pallette);
    if (key === "people") {
      const red = await canvas.findByRole(`${key}-comment`, {
        name: "color-icon-red",
      });
      await userEvent.click(red);
      expect(commentBox).toHaveClass(/red/);
      expect(commentBox).not.toHaveClass(/green/);
      expect(commentBox).not.toHaveClass(/blue/);
    } else if (key === "money") {
      const blue = await canvas.findByRole(`${key}-comment`, {
        name: "color-icon-blue",
      });
      await userEvent.click(blue);
      expect(commentBox).not.toHaveClass(/red/);
      expect(commentBox).not.toHaveClass(/green/);
      expect(commentBox).toHaveClass(/blue/);
    } else {
      const green = await canvas.findByRole(`${key}-comment`, {
        name: "color-icon-green",
      });
      expect(green).toBeInTheDocument;
      expect(commentBox).not.toHaveClass(/red/);
      expect(commentBox).toHaveClass(/green/);
      expect(commentBox).not.toHaveClass(/blue/);
    }
  }

  const objectiveLabels: LabelType = {
    "win-condition": "勝利条件",
    "gaining-goal": "獲得目標",
  };
  for (const key of Object.keys(objectiveLabels)) {
    expect(await canvas.findByRole(key, { name: "box" })).toBeInTheDocument();
    const textbox = await canvas.findByRole(key, {
      name: "textbox",
    });
    await userEvent.click(textbox);

    const commentIcon = await canvas.findByRole(key, {
      name: "comment-icon",
    });
    await userEvent.click(commentIcon);

    const commentArea = await canvas.findByRole(key, {
      name: "comment",
    });
    expect(commentArea).toBeInTheDocument();
    const commentTexbox = await canvas.findByRole(`${key}-comment`, {
      name: `textbox`,
    });
    await userEvent.type(commentTexbox, `${objectiveLabels[key]}のコメント`);
    expect(
      await canvas.findByDisplayValue(`${objectiveLabels[key]}のコメント`)
    );

    const commentBox = await canvas.findByRole(`${key}-comment`, {
      name: "box",
    });
    const pallette = await canvas.findByRole(`${key}-comment`, {
      name: "palette-icon",
    });
    await userEvent.click(pallette);
    const green = await canvas.findByRole(`${key}-comment`, {
      name: "color-icon-green",
    });
    await userEvent.click(green);
    expect(commentBox).toHaveClass(/green/);
    expect(commentBox).not.toHaveClass(/red/);
    expect(commentBox).not.toHaveClass(/blue/);
    const red = await canvas.findByRole(`${key}-comment`, {
      name: "color-icon-red",
    });
    expect(red).toBeInTheDocument;
    await userEvent.click(red);
    expect(commentBox).not.toHaveClass(/green/);
    expect(commentBox).toHaveClass(/red/);
    expect(commentBox).not.toHaveClass(/blue/);

    const blue = await canvas.findByRole(`${key}-comment`, {
      name: "color-icon-blue",
    });
    await userEvent.click(blue);
    expect(commentBox).not.toHaveClass(/green/);
    expect(commentBox).not.toHaveClass(/red/);
    expect(commentBox).toHaveClass(/blue/);
  }

  await userEvent.click(
    await canvas.findByRole("purpose", { name: "add-icon" })
  );
  for (let i = 0; i < 2; i++) {
    const commentIcon = (
      await canvas.findAllByRole("purpose", {
        name: "comment-icon",
      })
    )[i];
    await userEvent.click(commentIcon);

    const commentArea = (
      await canvas.findAllByRole("purpose", {
        name: "comment",
      })
    )[i];
    expect(commentArea).toBeInTheDocument();
    const commentTexbox = (
      await canvas.findAllByRole("purpose-comment", {
        name: `textbox`,
      })
    )[i];
    await userEvent.type(commentTexbox, `中間目的${i + 1}のコメント`);
    expect(await canvas.findByDisplayValue(`中間目的${i + 1}のコメント`));

    const commentBox = (
      await canvas.findAllByRole("purpose-comment", {
        name: "box",
      })
    )[i];
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
  }

  await userEvent.click(
    await canvas.findByRole("measure", { name: "add-box" })
  );
  for (let i = 0; i < 3; i++) {
    const commentIcon = (
      await canvas.findAllByRole("measure", {
        name: "comment-icon",
      })
    )[i];
    await userEvent.click(commentIcon);

    const commentArea = (
      await canvas.findAllByRole("measure", {
        name: "comment",
      })
    )[i];
    expect(commentArea).toBeInTheDocument();
    const commentTexbox = (
      await canvas.findAllByRole("measure-comment", {
        name: `textbox`,
      })
    )[i];
    await userEvent.type(commentTexbox, `施策${i + 1}のコメント`);
    expect(await canvas.findByDisplayValue(`施策${i + 1}のコメント`));

    const commentBox = (
      await canvas.findAllByRole("measure-comment", {
        name: "box",
      })
    )[i];
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
  }
};

export const previewTest = async ({ canvasElement }: StorybookTestProps) => {
  const canvas = within(canvasElement);

  const elements = await canvas.findByRole("elements", { name: "box" });
  expect(elements).toBeInTheDocument();

  type LabelType = {
    [K in string]: string;
  };
  const elementLabels: LabelType = {
    people: "ひと",
    money: "お金",
    time: "時間",
    quality: "クオリティ",
    businessScheme: "商流 / 座組",
    environment: "環境",
    rival: "ライバル",
    foreignEnemy: "外敵",
  };
  for (const key of Object.keys(elementLabels)) {
    expect(
      await canvas.findByRole("element", {
        name: `comment-icon-${key}`,
      })
    ).toBeInTheDocument();
    expect(
      await canvas.findByDisplayValue(`${elementLabels[key]}のコメント`)
    ).toBeInTheDocument();
    const textbox = await canvas.findByRole("element", {
      name: `${key}-textbox`,
    });
    expect(textbox).toHaveAttribute("readonly");
    const commentTextbox = await canvas.findByRole(`${key}-comment`, {
      name: "textbox",
    });
    expect(commentTextbox).toHaveAttribute("readonly");
  }

  const objectiveLabels: LabelType = {
    "win-condition": "勝利条件",
    "gaining-goal": "獲得目標",
  };
  for (const key of Object.keys(objectiveLabels)) {
    const textbox = await canvas.findByRole(key, {
      name: "textbox",
    });
    expect(textbox).toHaveAttribute("readonly");
    const commentTextbox = await canvas.findByRole(`${key}-comment`, {
      name: "textbox",
    });
    expect(commentTextbox).toHaveAttribute("readonly");
    expect(
      await canvas.findByDisplayValue(`${objectiveLabels[key]}のコメント`)
    );
  }

  for (let i = 0; i < 1; i++) {
    expect(
      (
        await canvas.findAllByRole("purpose", {
          name: "comment-icon",
        })
      )[i]
    ).toBeInTheDocument();
    const textbox = (
      await canvas.findAllByRole("purpose", {
        name: `textbox`,
      })
    )[i];
    expect(textbox).toHaveAttribute("readonly");
    const commentTextbox = (
      await canvas.findAllByRole("purpose-comment", {
        name: `textbox`,
      })
    )[i];
    expect(commentTextbox).toHaveAttribute("readonly");
    expect(await canvas.findByDisplayValue("中間目的のコメント"));
  }

  for (let i = 0; i < 2; i++) {
    expect(
      (
        await canvas.findAllByRole("measure", {
          name: "comment-icon",
        })
      )[i]
    ).toBeInTheDocument;

    const textbox = (
      await canvas.findAllByRole("measure", {
        name: "textbox",
      })
    )[i];
    expect(textbox).toHaveAttribute("readonly");
    const commentTexbox = (
      await canvas.findAllByRole("measure-comment", {
        name: `textbox`,
      })
    )[i];
    expect(commentTexbox).toHaveAttribute("readonly");
    expect(await canvas.findByDisplayValue(`施策${i + 1}のコメント`));
  }
};
