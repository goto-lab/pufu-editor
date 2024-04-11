import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { fn } from "@storybook/test";
import { Comment } from "../components/Comment";
import { CommentModel } from "../lib/models";
import { blueTest, previewTest } from "../tests/Comment.stories.test";
import i18n from "../i18n/config";
import { useI18Translation } from "../lib/hooks";
i18n.changeLanguage("ja");

const meta = {
  title: "pufu-editor/Comment",
  component: Comment,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Comment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Blue: Story = {
  args: {
    comment: {
      color: "blue",
      text: "サンプルテキストです",
    },
    onChange: fn(),
  },
  render: function Comp({ ...args }) {
    const { i18n } = useI18Translation("ja");
    const [comment] = React.useState<CommentModel>({
      color: "blue",
      text: "",
    });
    return (
      <meta.component {...args} comment={comment} i18n={i18n}></meta.component>
    );
  },
  play: blueTest,
};
export const Green: Story = {
  args: {
    comment: {
      color: "green",
      text: "サンプルテキストです",
    },
    onChange: fn(),
  },
};

export const Red: Story = {
  args: {
    comment: {
      color: "red",
      text: "サンプルテキストです",
    },
    onChange: fn(),
  },
};

export const Upside: Story = {
  args: {
    comment: {
      color: "blue",
      text: "サンプルテキストです",
    },
    onChange: fn(),
    upside: true,
  },
};

export const preview: Story = {
  args: {
    comment: {
      color: "blue",
      text: "サンプルテキストです",
    },
    onChange: fn(),
    preview: true,
  },
  play: previewTest,
};
