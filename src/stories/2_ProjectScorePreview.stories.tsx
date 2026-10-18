import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectScore } from "../components/ProjectScore";
import {
  createPreviewRegressionScore,
  previewRegressionTest,
} from "../tests/ProjectScorePreview.stories.test";

const meta = {
  title: "pufu-editor/ProjectScorePreview",
  component: ProjectScore,
  tags: ["preview-regression"],
  parameters: { layout: "fullscreen" },
  args: {
    initScore: createPreviewRegressionScore(),
    preview: true,
    feedback: true,
    showProgress: true,
    width: 1000,
  },
  render: function PreviewToggle(args) {
    const [preview, setPreview] = useState(args.preview);
    const [initScore] = useState(() => structuredClone(args.initScore));
    return (
      <>
        <button aria-pressed={preview} onClick={() => setPreview(!preview)}>
          プレビュー切り替え
        </button>
        <ProjectScore {...args} initScore={initScore} preview={preview} />
      </>
    );
  },
  play: previewRegressionTest,
} satisfies Meta<typeof ProjectScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopOneColumn: Story = {};
export const DesktopOneColumnDark: Story = { args: { dark: true } };
export const DesktopTwoColumn: Story = { args: { width: 2400 } };
export const DesktopTwoColumnDark: Story = {
  args: { width: 2400, dark: true },
};
export const Mobile: Story = { args: { mobile: true, width: 390 } };
export const MobileDark: Story = {
  args: { mobile: true, width: 390, dark: true },
};
