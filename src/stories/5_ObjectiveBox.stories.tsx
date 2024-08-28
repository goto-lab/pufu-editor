import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { ObjectiveBox } from "../components/ObjectiveBox";
import { ObjectiveModel } from "../lib/models";
import {
  feedbackTest,
  gainingGoalTest,
  previewTest,
  TextBaseTest,
  TextLargeTest,
  winConditionTest,
} from "../tests/Objective.stories.test";
import i18n from "../i18n/config";
i18n.changeLanguage("ja");

const meta = {
  title: "pufu-editor/ObjectiveBox",
  component: ObjectiveBox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ObjectiveBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GainingGoal: Story = {
  args: {
    label: "GainingGoal",
    goal: {
      uuid: "123",
      text: "",
      comment: {
        color: "blue",
        text: "コメントのサンプルテキストです。",
      },
    },
    i18n: i18n,
  },
  render: function Comp({ ...args }) {
    const [goal, setGoal] = React.useState<ObjectiveModel>({
      uuid: "123",
      text: "",
      comment: {
        color: "blue",
        text: "コメントのサンプルテキストです。",
      },
    });
    return (
      <meta.component
        {...args}
        goal={goal}
        label={"GainingGoal"}
        onChange={setGoal}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: gainingGoalTest,
};

export const WinCondition: Story = {
  args: {
    label: "WinCondition",
    goal: {
      uuid: "123",
      text: "",
      comment: {
        color: "blue",
        text: "コメントのサンプルテキストです。",
      },
    },
    onChange: fn(),
    i18n: i18n,
  },
  play: winConditionTest,
};

export const Feedback: Story = {
  args: {
    label: "WinCondition",
    goal: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "",
      },
    },
    onChange: fn(),
    feedback: true,
    i18n: i18n,
  },
  play: feedbackTest,
};

export const Preview: Story = {
  args: {
    label: "WinCondition",
    goal: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
    },
    feedback: true,
    preview: true,
    i18n: i18n,
  },
  play: previewTest,
};

export const TextBase: Story = {
  args: {
    label: "WinCondition",
    goal: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
    },
    feedback: true,
    preview: true,
    i18n: i18n,
    textSize: "base",
  },
  play: TextBaseTest,
};

export const TextLarge: Story = {
  args: {
    label: "WinCondition",
    goal: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
    },
    feedback: true,
    preview: true,
    i18n: i18n,
    textSize: "large",
  },
  play: TextLargeTest,
};
