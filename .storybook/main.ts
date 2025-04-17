import type { StorybookConfig } from "@storybook/react-vite";
import type { AddonOptionsVite } from "@storybook/addon-coverage";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-coverage",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  managerHead: (head) => `${head}
    <link rel="icon" href="/favicon.ico">
    <meta name="description" content="プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』で 紹介されているプロジェクト譜（略称: プ譜）を Webブラウザで編集・表示するためのエディターです。">
`,
};
export default config;
