import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  ProjectScore,
  getScoreJson,
  setScore,
} from "../components/ProjectScore";
import {
  editTest,
  feedbackTest,
  previewTest,
} from "../tests/ProjectScore.stories.test";
import {
  createInitialScoreDataWithComment,
  createInitialScoreDataWithDuplication,
} from "../tests/common";
import { DownloadButton, ImportButton, ModalDialog } from "./common";

const meta = {
  title: "pufu-editor/ProjectScore",
  component: ProjectScore,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Edit: Story = {
  args: {},
  play: editTest,
};
export const Feedback: Story = {
  args: {
    feedback: true,
  },
  play: feedbackTest,
};
export const FeedbackDuplication: Story = {
  args: {
    initScore: createInitialScoreDataWithDuplication(),
    feedback: true,
  },
};
export const Preview: Story = {
  args: {
    initScore: createInitialScoreDataWithComment(),
    preview: true,
  },
  play: previewTest,
};
export const English: Story = {
  args: {
    lang: "en",
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
  },
  play: editTest,
};

export const Download: Story = {
  args: {
    uniqueKey: "sample",
    feedback: true,
  },
  render: function Comp({ ...args }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    return (
      <>
        <DownloadButton scoreKey="sample" kind="json" />
        <DownloadButton scoreKey="sample" kind="png" />
        <DownloadButton scoreKey="sample" kind="svg" />
        <ImportButton
          onClick={() => {
            const json = getScoreJson("sample");
            setScoreText(json!);
            setIsOpen(true);
            setError("");
          }}
        />
        <p className="ml-8">ID: sample</p>
        <meta.component {...args}></meta.component>
        <ModalDialog
          open={isOpen}
          text={scoreText}
          error={error}
          onCancel={() => setIsOpen(false)}
          onChange={(text: string) => {
            setScoreText(text);
          }}
          onOk={() => {
            try {
              setError("");
              setScore("sample", scoreText);
              setIsOpen(false);
            } catch (e) {
              console.error(e);
              if (e instanceof Error) {
                setError(e.message);
              }
            }
          }}
        />
      </>
    );
  },
};
