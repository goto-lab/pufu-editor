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
  LocalSave,
  ModalDialog,
  exampleData,
} from "./common";

const meta = {
  title: "pufu-editor/Examples",
  component: ProjectScore,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で<br>
紹介されているプロジェクト譜（プ譜）を Web ブラウザで編集・表示するためのエディターです。<br>
Github: <a href="https://github.com/goto-lab/pufu-editor" target="_blank">goto-lab/pufu-editor</a>`,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProjectScore>;

export default meta;
type Story = StoryObj<typeof meta>;
const key1 = "example1";
const key2 = "example2";

const isMobile = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(max-device-width: 640px)").matches
  ) {
    return true;
  } else {
    return false;
  }
};

export const Example1: Story = {
  args: {
    uniqueKey: key1,
    initScore: exampleData,
    preview: true,
    mobile: isMobile(),
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
    mobile: isMobile(),
  },
  render: function Comp({ ...args }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scoreText, setScoreText] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLocalSave, setIsLocalSave] = React.useState(false);
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
        <LocalSave
          checked={isLocalSave}
          onClick={(status: boolean) => {
            setIsLocalSave(status);
          }}
          onLoad={() => {
            const json = localStorage.getItem(key2);
            if (json) {
              setScore(key2, json);
            }
          }}
          onSave={() => {
            const json = getScoreJson(key2);
            console.log(json);
            if (json) {
              localStorage.setItem(key2, json);
            }
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
