# プ譜エディター

![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg).
![React](https://img.shields.io/badge/react-v18.2.0-blue)
![React](https://img.shields.io/badge/tailwindcss-v3.4.15-blue)
![Strorybook](https://img.shields.io/badge/storybook-v8.0.4-red)

プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』（著: 前田考歩、後藤洋平）で
紹介されているプロジェクト譜（以下、プ譜）を Web ブラウザで編集・表示するためのエディターです。

## デモ

プ譜エディターの[Storybookページ](https://goto-lab.github.io/pufu-editor)をご覧ください。

## インストールおよび設定

プ譜エディタおよびTailwind CSSインストール

```
npm install @goto-lab/pufu-editor
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
- モバイルモード: 従来の縦長表示（`mobile={true}`）
- 横並び表示: 表示エリアが狭い場合はミニマップ付きのスクロール表示へ自動切り替え（`mobile={false}`、デフォルト）
- 言語選択: 日本語と英語のラベル表記
- テキストサイズ: `xsmall` / `small`（デフォルト） / `base` / `large`（例: `<ProjectScore textSize="xsmall" />`）

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

`mobile={true}`は従来の縦長表示です。`mobile={false}`（デフォルト）の場合、端末の種類にかかわらず、プ譜を置く表示エリアの幅が900px未満になると、ミニマップ付きのスクロール表示に切り替わります。ウィンドウやサイドパネルの幅変更にも追従し、八要素・施策・中間目的・勝利条件の横並びと接続線を保ちます。
プ譜内を縦横にスクロールでき、ミニマップのタップ・ドラッグや矢印キーで表示位置を移動できます。ミニマップは半透明の背景で重ねて表示し、廟算八要素は一つの箱にまとめます。右上の×で閉じた後は、右下のマップボタンから再表示できます。マップ表示のための下余白は追加しません。
キャンバスの最小幅は900pxで、`width`でさらに広げられます。`width`が900pxより大きい場合、その幅未満で自動的に切り替わります。`mobile={true}`の場合は幅にかかわらず縦長表示となり、ミニマップは表示しません。ミニマップ表示中の表示エリアの高さは画面の80%以内に収まります。

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

本モジュールはBSDライセンス (3-clause BSD License)にて提供致します。
原則として、重要な場所にコピーライト表記を記載いただければ、自社サービスの事例紹介やオウンドメディアでのプロジェクトストーリー紹介など、自由に利用いただくことができます。

本モジュールを本格的に商用利用したい、つまり、プ譜が収益やユーザーの獲得における主要な要素となるような事業、製品、サービス等を展開したいご意向がある場合は、上述の利用の対象外となるため、是非、お気軽に、当社の連絡窓口（info@gotolab.co.jp）まで、ご一報いただけると幸いです。
過去の取り組みを通じて蓄積されてきた事例情報や知識、ノウハウのご提供、事業提携、ネットワーキング支援等、幅広くご相談のうえ、良い形での協力関係を構築させていただきたく存じます。

「キックプ譜」及び「プ譜エディタ」は、「予定通り進まないプロジェクトの進め方」の共著者である前田氏と、開発者である山下氏の両名と一緒に進めている取り組みです。
紛争や誤用、悪用等の防止のため、プ譜は株式会社ゴトーラボにて商標登録しております。利用者は、プ譜エディターを利用した場合、本項目の内容に同意したものとみなします。

## Examples

- [first-install-example](https://github.com/goto-lab/pufu-editor/tree/main/examples/first-install-example)
  - プ譜エディターのシンプルなインストール例
- [amplify-gen2-example](https://github.com/goto-lab/pufu-editor/tree/main/examples/amplify-gen2-example)
  - [AWS Amplify Gen2](https://docs.amplify.aws/)を利用してAWS上にデータを保存、読み込みを行う例
- [vision-analyze-example](https://github.com/goto-lab/pufu-editor/tree/main/examples/vision-analyze-example)
  - [OpenAI API](https://openai.com/index/openai-api/)を利用してプ譜の画像を解析し、プ譜のデータを抽出する例
- [amplify-pinecone-example](https://github.com/goto-lab/pufu-editor/tree/main/examples/amplify-pinecone-example)
  - ベクトルデータベースの[pinecone](https://www.pinecone.io/)を利用してプ譜の検索及び異なるプ譜の要素間の類似度を算出する例
  - amplify-gen2-exampleの拡張のためプ譜はAWS上に保存
- [project-dialogue-example](https://github.com/goto-lab/pufu-editor/tree/main/examples/project-dialogue-example)
  - 音声対話機能付きのプロジェクト振り返りシステム。OpenAI/Gemini APIとVOICEVOXを使用した音声合成機能を備えた例
- [pufu-generator-skill](https://github.com/goto-lab/pufu-editor/tree/main/examples/pufu-generator-skill)
  - 既存のドキュメント（PowerPoint、Excel、PDF、Word、テキスト）からプ譜エディタ互換のJSONデータを自動生成するClaude Codeスキルの例

## 活動履歴

- [Open Source Conference 2024 Kyoto](https://event.ospn.jp/osc2024-kyoto/) (展示)
- [Open Source Conference 2025 Osaka](https://event.ospn.jp/osc2025-osaka/) (展示)
- [Open Source Conference 2025 Kyoto](https://event.ospn.jp/osc2025-kyoto/) (展示)
- [Open Source Conference 2026 Osaka](https://event.ospn.jp/osc2026-osaka/) (展示・セミナー)