import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { ProjectScore } from "../components/ProjectScore";

const meta = {
  title: "pufu-editor/ProjectScoreDarkMode",
  component: ProjectScore,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  args: {
    dark: true,
  },
};
export const Feedback: Story = {
  args: {
    feedback: true,
    dark: true,
  },
};
export const Preview: Story = {
  args: {
    preview: true,
    dark: true,
  },
};
export const English: Story = {
  args: {
    lang: "en",
    dark: true,
  },
  render: function Comp({ ...args }) {
    return (
      <>
        <p>※Docsでは英語表示不可</p>
        <meta.component {...args}></meta.component>
      </>
    );
  },
};
export const Mobile: Story = {
  args: {
    feedback: true,
    mobile: true,
    dark: true,
  },
};
