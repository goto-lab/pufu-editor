# プ譜エディター

![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg).
![React](https://img.shields.io/badge/react-v18.2.0-blue)
![React](https://img.shields.io/badge/tailwindcss-v3.4.3-blue)
![Strorybook](https://img.shields.io/badge/storybook-v8.0.5-red)

プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で
紹介されているプロジェクト譜（以下、プ譜）を Web ブラウザで編集・表示するためのエディターです。

## デモ

プ譜エディターの[Storybookページ](https://goto-lab.github.io/pufu-editor)をご覧ください。

## インストールおよび設定

プ譜エディタおよびTailwind CSSインストール

```
npm install tailwindcss --save-dev
npm install @goto-lab/pufu-editor
```

tailwind.config.jsの設定を変更

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@goto-lab/pufu-editor/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

src/index.cssに@tailwindディレクティブを追加

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

src/App.js

```
import { ProjectScore } from "@goto-lab/pufu-editor";

function App() {
  return (
    <div className="p-4">
      <ProjectScore />
    </div>
  );
}

export default App;
```

参考: [Install Tailwind CSS with Create React App](https://tailwindcss.com/docs/guides/create-react-app)

## 機能

### プ譜の表示・編集

- 編集モード: プ譜の編集(デフォルト)
- フィードバックモード: プ譜の編集＋コメントを追記できるモード
- プレビューモード: 編集不可の表示モード
- ダークモード: ダークモード表示
- モバイルモード: モバイル向け表示
- 言語選択: 日本語と英語のラベル表記

**設定例**

フィードバックモード & ダークモード  
※ダークモードはTailwindcssのダークモードのClassを利用

```
<ProjectScore feedback={true} dark={true}/>
```

プレビューモード & モバイルモード & 英語表示

```
<ProjectScore preview={true} mobile={true} lang="en"/>
```

### エクスポート機能

- JSON の取得
- JSON ファイルのダウンロード
- 画像ダウンロード(形式: PNG、SVG)

```
import {
  ProjectScore,
  getScoreJson,
  downloadScore,
} from "../components/ProjectScore";


//uniqueKeyを設定
<ProjectScore uniqueKey="sample1"/>

//uniqueKeyを指定してエクスポート
//json取得
const json = getJson("sample1");

//ダウンロード
download("sample1", "json");
download("sample1", "svg");
download("sample1", "png");
```

## ライセンス

BSD License (3-clause BSD License)
