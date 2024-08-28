import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { IntermediatePurpose } from "../components/IntermediatePurpose";
import { IntermediatePurposeModel } from "../lib/models";
import {
  bottomTest,
  editTest,
  topTest,
  feedbackTest,
  previewTest,
  textLargeTest,
  textBaseTest,
} from "../tests/IntermediatePurpose.stories.test";
import i18n from "../i18n/config";
i18n.changeLanguage("ja");

const meta = {
  title: "pufu-editor/IntermediatePurpose",
  component: IntermediatePurpose,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IntermediatePurpose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [],
    },
    index: 0,
    count: 1,
    preveMeasureCount: 0,
  },
  render: function Comp() {
    const [purpose, setPurpose] = React.useState<IntermediatePurposeModel>({
      uuid: "123",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [],
    });
    return (
      <meta.component
        purpose={purpose}
        onChange={setPurpose}
        index={1}
        count={3}
        i18n={i18n}
        preveMeasureCount={0}
      ></meta.component>
    );
  },
  play: editTest,
};

export const Top: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [],
    },
    index: 0,
    count: 3,
    preveMeasureCount: 0,
    i18n: i18n,
  },
  play: topTest,
};

export const Bottom: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [],
    },
    index: 2,
    count: 3,
    preveMeasureCount: 2,
    i18n: i18n,
  },
  play: bottomTest,
};

export const Feedback: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [],
    },
    feedback: true,
    onAction: fn(),
    onAdd: fn(),
    onDelete: fn(),
    onDown: fn(),
    onUp: fn(),
    onChange: fn(),
    index: 0,
    count: 1,
    preveMeasureCount: 0,
    i18n: i18n,
  },
  play: feedbackTest,
};

export const Preview: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
      measures: [],
    },
    preview: true,
    index: 0,
    count: 1,
    preveMeasureCount: 0,
    i18n: i18n,
  },
  play: previewTest,
};

export const TextBase: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
      measures: [],
    },
    preview: true,
    index: 0,
    count: 1,
    preveMeasureCount: 0,
    i18n: i18n,
    textSize: "base",
  },
  play: textBaseTest,
};

export const TextLarge: Story = {
  args: {
    purpose: {
      uuid: "123",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
      measures: [],
    },
    preview: true,
    index: 0,
    count: 1,
    preveMeasureCount: 0,
    i18n: i18n,
    textSize: "large",
  },
  play: textLargeTest,
};
