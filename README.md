# プ譜エディター

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/react-v18.2.0-blue)
![React](https://img.shields.io/badge/tailwindcss-v3.4.3-blue)
![Strorybook](https://img.shields.io/badge/storybook-v8.0.5-red)

プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で
紹介されているプロジェクト譜（以下、プ譜）を Web ブラウザで編集・表示するためのエディターです。

## デモ

プ譜エディターの[Storybookページ](https://goto-lab.github.io/pufu-editor)をご覧ください。

## インストール

Tailwind CSSを利用するためインストールしてください。

```
npm install tailwindcss --save-dev
npm install @dyson-yamashita/pufu-editor
```

## プ譜エディタの設定

```
import { ProjectScore } from "pufu-editor";
import "./App.css";

function App() {
  return (
    <div className="p-4">
      <ProjectScore />
    </div>
  );
}

export default App;
```

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

MIT ライセンス
