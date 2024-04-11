import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  ProjectScore,
  getScoreJson,
  setScore,
} from "../components/ProjectScore";
import {
  DownloadButton,
  ImportButton,
  ModalDialog,
  exampleData,
} from "./common";

const meta = {
  title: "pufu-editor/Examples",
  component: ProjectScore,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectScore>;

export default meta;
type Story = StoryObj<typeof meta>;
const key1 = "example1";
const key2 = "example2";

export const Example1: Story = {
  args: {
    uniqueKey: key1,
    initScore: exampleData,
    preview: true,
  },
  render: function Comp({ ...args }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    return (
      <>
        <DownloadButton scoreKey={key1} kind="json" />
        <DownloadButton scoreKey={key1} kind="png" />
        <DownloadButton scoreKey={key1} kind="svg" />
        <ImportButton
          onClick={() => {
            const json = getScoreJson(key1);
            setScoreText(json!);
            setIsOpen(true);
            setError("");
          }}
        />
        <p className="ml-8">ID: {key1}</p>
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
              setScore(key1, scoreText);
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

export const Example2: Story = {
  args: {
    uniqueKey: key2,
    feedback: true,
  },
  render: function Comp({ ...args }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    return (
      <>
        <DownloadButton scoreKey={key2} kind="json" />
        <DownloadButton scoreKey={key2} kind="png" />
        <DownloadButton scoreKey={key2} kind="svg" />
        <ImportButton
          onClick={() => {
            const json = getScoreJson(key2);
            setScoreText(json!);
            setIsOpen(true);
            setError("");
          }}
        />
        <p className="ml-8">ID: {key2}</p>
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
              setScore(key2, scoreText);
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
