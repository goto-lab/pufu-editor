import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { EightElements } from "../components/EightElements";
import {
  editTest,
  feedbackTest,
  previewTest,
} from "../tests/EightElements.stories.test";
import { EightElementsModel, ElementModel } from "../lib/models";
import i18n from "../i18n/config";
i18n.changeLanguage("ja");

const meta = {
  title: "pufu-editor/EightElements",
  component: EightElements,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EightElements>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultValue: ElementModel = {
  uuid: "123",
  text: "",
  comment: {
    color: "blue",
    text: "",
  },
};
const defaultElements: EightElementsModel = {
  people: defaultValue,
  money: defaultValue,
  time: defaultValue,
  quality: defaultValue,
  businessScheme: defaultValue,
  environment: defaultValue,
  rival: defaultValue,
  foreignEnemy: defaultValue,
};
const commentValue = (label: string): ElementModel => {
  return {
    uuid: "123",
    text: `${label}のテキスト`,
    comment: {
      color: "blue",
      text: `${label}のコメント`,
    },
  };
};

const commentElements: EightElementsModel = {
  people: commentValue("ひと"),
  money: commentValue("お金"),
  time: commentValue("時間"),
  quality: commentValue("クオリティ"),
  businessScheme: commentValue("商流 / 座組"),
  environment: commentValue("環境"),
  rival: commentValue("ライバル"),
  foreignEnemy: commentValue("外敵"),
};

export const Edit: Story = {
  args: {
    elements: defaultElements,
  },
  render: function Comp() {
    const [elements, setElements] =
      React.useState<EightElementsModel>(defaultElements);
    return (
      <meta.component
        elements={elements}
        onChange={setElements}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: editTest,
};

export const Feedback: Story = {
  args: {
    elements: defaultElements,
    feedback: true,
    i18n: i18n,
    onChange: fn(),
  },
  play: feedbackTest,
};

export const Preview: Story = {
  args: {
    elements: commentElements,
    preview: true,
    i18n: i18n,
  },
  play: previewTest,
};
