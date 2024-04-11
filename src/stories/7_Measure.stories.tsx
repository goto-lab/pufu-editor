import React, { useState } from "react";
import { StoryObj, Meta } from "@storybook/react";
import { Measure } from "../components/Measure";
import { MeasureModel } from "../lib/models";
import {
  whiteTest,
  feedbackTest,
  previewTest,
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
    index: 0,
    count: 1,
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
    index: 0,
    count: 1,
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
    index: 0,
    count: 1,
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
    index: 0,
    count: 1,
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
    index: 0,
    count: 1,
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
    index: 0,
    count: 1,
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
    index: 0,
    count: 1,
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
