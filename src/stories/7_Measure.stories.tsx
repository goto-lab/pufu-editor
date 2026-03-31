import React, { useState } from "react";
import { StoryObj, Meta } from "@storybook/react";
import { Measure } from "../components/Measure";
import { MeasureModel } from "../lib/models";
import {
  whiteTest,
  feedbackTest,
  previewTest,
  textBaseTest,
  textLargeTest,
  progressEditTest,
  progressPreviewTest,
} from "../tests/Measure.stories.test";
import i18n from "../i18n/config";
i18n.changeLanguage("ja");

const meta = {
  title: "pufu-editor/Measure",
  component: Measure,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Measure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const White: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "white",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
  },
  render: function Comp({ ...args }) {
    const [measure, setMeasure] = React.useState<MeasureModel>({
      uuid: "1234",
      color: "white",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    });
    return (
      <meta.component
        {...args}
        measure={measure}
        onChange={setMeasure}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: whiteTest,
};
export const Blue: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "blue",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
  },
};
export const Green: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "green",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
  },
};

export const Red: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "red",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
  },
};

export const Yellow: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "yellow",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
  },
};
export const Feedback: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "white",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
  },
  render: function Comp({ ...args }) {
    const [measure, setMeasure] = useState<MeasureModel>({
      uuid: "1234",
      color: "white",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "",
      },
    });
    return (
      <meta.component
        {...args}
        measure={measure}
        onChange={setMeasure}
        feedback={true}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: feedbackTest,
};
export const Preview: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "white",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
    },
  },
  render: function Comp({ ...args }) {
    const [measure, setMeasure] = useState<MeasureModel>({
      uuid: "1234",
      color: "white",
      text: "サンプルテキストです。",
      comment: {
        color: "blue",
        text: "コメントのテキストです。",
      },
    });
    return (
      <meta.component
        {...args}
        measure={measure}
        onChange={setMeasure}
        preview={true}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: previewTest,
};

export const WithProgress: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "green",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
      progress: 60,
    },
    i18n: i18n,
  },
  render: function Comp({ ...args }) {
    const [measure, setMeasure] = useState<MeasureModel>({
      uuid: "1234",
      color: "green",
      text: "OSSとしてコードを公開する",
      comment: {
        color: "blue",
        text: "",
      },
      progress: 60,
    });
    return (
      <meta.component
        {...args}
        measure={measure}
        onChange={setMeasure}
        showProgress={true}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: progressEditTest,
};

export const WithProgressPreview: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "red",
      text: "",
      comment: {
        color: "blue",
        text: "",
      },
      progress: 80,
    },
  },
  render: function Comp({ ...args }) {
    const [measure, setMeasure] = useState<MeasureModel>({
      uuid: "1234",
      color: "red",
      text: "キックプ譜を開発する中で感じた機能的課題を解消する",
      comment: {
        color: "blue",
        text: "",
      },
      progress: 80,
    });
    return (
      <meta.component
        {...args}
        measure={measure}
        onChange={setMeasure}
        preview={true}
        showProgress={true}
        i18n={i18n}
      ></meta.component>
    );
  },
  play: progressPreviewTest,
};

export const TextBase: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "green",
      text: "サンプルテキスト",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
    textSize: "base",
  },
  play: textBaseTest,
};

export const TextLarge: Story = {
  args: {
    measure: {
      uuid: "1234",
      color: "green",
      text: "サンプルテキスト",
      comment: {
        color: "blue",
        text: "",
      },
    },
    i18n: i18n,
    textSize: "large",
  },
  play: textLargeTest,
};
