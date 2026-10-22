import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { ProjectScore } from "../components/ProjectScore";
import { exampleData } from "./common";
import {
  narrowMinimapTest,
  mobilePreviewTest,
} from "../tests/ProjectScore.stories.test";

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

export const MobilePreview: Story = {
  args: {
    initScore: exampleData,
    preview: true,
    mobile: true,
    dark: true,
    textSize: "base",
  },
  render: (args) => (
    <div style={{ maxWidth: 390, margin: "0 auto" }}>
      <ProjectScore {...args} />
    </div>
  ),
  play: mobilePreviewTest,
};

export const NarrowPreview: Story = {
  args: {
    initScore: exampleData,
    preview: true,
    mobile: false,
    dark: true,
    textSize: "base",
  },
  render: (args) => (
    <div
      data-testid="resizable-score"
      style={{ maxWidth: 640, margin: "0 auto" }}
    >
      <ProjectScore {...args} />
    </div>
  ),
  play: narrowMinimapTest,
};
