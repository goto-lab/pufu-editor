import type { TestRunnerConfig } from "@storybook/test-runner";
import { previewBrowserTest } from "../src/tests/ProjectScorePreview.browser";

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    if (context.title !== "pufu-editor/ProjectScorePreview") return;
    await page.setViewportSize({
      width: context.id.includes("mobile") ? 430 : 2600,
      height: 1600,
    });
  },
  async postVisit(page, context) {
    if (context.title !== "pufu-editor/ProjectScorePreview") return;
    await previewBrowserTest(
      page,
      context.id.includes("--mobile"),
      context.id.includes("--desktop-two-column"),
    );
  },
};

export default config;
