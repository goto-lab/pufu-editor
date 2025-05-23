# プ譜エディター GitHub Copilot カスタム指示

## プロジェクト概要

プ譜エディターは書籍『予定通り進まないプロジェクトの進め方』で紹介されているプロジェクト譜（プ譜）をWebブラウザで編集・表示するためのエディターです。プ譜は下記の構成要素からなります：

- 獲得目標：プロジェクトの目標・ミッション
- 勝利条件：プロジェクト成功の判断基準・評価指標の条件
- 中間目的：勝利条件を達成するための「あるべき条件」。1つの勝利条件に対して複数の中間目的がありえます。
- 施策：各中間目的を実現するための具体的な行動。1つの中間目的に対して複数の施策がありえます。
- 施策には色があり、プロジェクトにおける重要度や性質を示します：
  - white: 標準的なアクション
  - red: 目標達成のために、当然取り組むべき主なアクション
  - green: 面倒でも、やらなければならないこと
  - blue: 後々発生するかもしれない問題への予防策
  - yellow: 人、お金、時間等の資源に余裕があればやりたいこと
- 廟算八要素：人やお金、時間といったリソースや条件
  - ひと: 価値観、実績、メンバー、顧客など
  - お金: 予算、目標、利益、コストなど
  - 時間: スケジュール、作業時間など
  - クオリティ: 満足感、仕上がり間、技術など
  - 商流/座組: ビジネスモデル/価値やお金の流れなど
  - 環境: 業界、組織、国・地域など
  - ライバル: 同じ成果や資源を取り合う存在
  - 外敵: 目的を積極的に邪魔するヒトやコト

## プ譜のデータ構造

プ譜は以下のようなJSON形式で表されます：

```javascript
{
  "winCondition": {
    "uuid": "ユニークID",
    "text": "勝利条件のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "gainingGoal": {
    "uuid": "ユニークID",
    "text": "獲得目標のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "purposes": [
    {
      "uuid": "ユニークID",
      "text": "中間目的のテキスト",
      "comment": {
        "color": "blue",
        "text": ""
      },
      "measures": [
        {
          "uuid": "ユニークID",
          "text": "施策のテキスト",
          "comment": {
            "color": "blue",
            "text": ""
          },
          "color": "white" // "white", "red", "green", "blue", "yellow"のいずれか
        },
        // ... 他の施策
      ]
    },
    // ... 他の中間目的
  ],
  "elements": {
    "people": {
      "uuid": "ユニークID",
      "text": "ひとのテキスト",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "money": { /* ... */ },
    "time": { /* ... */ },
    "quality": { /* ... */ },
    "businessScheme": { /* ... */ },
    "environment": { /* ... */ },
    "rival": { /* ... */ },
    "foreignEnemy": { /* ... */ }
  }
}
```

## ディレクトリ構造

```
├── .github      # GitHub関連ファイル
├── .storybook   # Storybook設定
├── examples     # 利用例
│    ├── first-install-example     # シンプルなインストール例
│    ├── amplify-gen2-example      # AWS Amplify Gen2を利用した例
│    ├── vision-analyze-example    # OpenAI APIを利用したプ譜画像解析例
│    └── amplify-pinecone-example  # ベクトルDBを用いた検索例
└── src
     ├── components # 画面のパーツ
     ├── i18n       # 多言語設定
     │    └── locales # 多言語辞書
     ├── lib        # 共通機能やモデル定義
     ├── stories    # コンポーネントごとのStorybook実装
     └── tests      # テストコード
```

## 機能とAPI

### エクスポート機能

プ譜エディターは以下のエクスポート機能を提供しています:

```javascript
import {
  ProjectScore,
  getScoreJson,
  downloadScore,
} from "../components/ProjectScore";

// uniqueKeyを設定
<ProjectScore uniqueKey="sample1"/>

// uniqueKeyを指定してエクスポート
// json取得
const json = getJson("sample1");

// ダウンロード
download("sample1", "json");
download("sample1", "svg");
download("sample1", "png");
```

### コンポーネントの使い方

テストでは主に下記のようなロールを使用してコンポーネントにアクセスします:

```typescript
// 中間目的のコンポーネントのロール例
const textbox = await canvas.findByRole("purpose", { name: "textbox" });
const deleteIcon = await canvas.findByRole("purpose", { name: "delete-icon" });
const upIcon = await canvas.findByRole("purpose", { name: "up-icon" });
const downIcon = await canvas.findByRole("purpose", { name: "down-icon" });
const addIcon = await canvas.findByRole("purpose", { name: "add-icon" });
```

## TypeScript/React コードスタイル

### 基本方針
- コードは明確で読みやすく、メンテナンス性の高いものであること
- TypeScriptの型安全性を最大限に活用すること
- Reactのベストプラクティスに従うこと
- TailwindCSSを使用したスタイリングを行うこと

### 命名規則
- コンポーネント: PascalCase (例: `ProjectScore`)
- 関数: camelCase (例: `getScoreJson`)
- 変数: camelCase (例: `scoreData`)
- インターフェース: 先頭に`I`をつけたPascalCase (例: `IScoreData`)
- 型: PascalCase (例: `ScoreType`)
- 定数: UPPER_SNAKE_CASE (例: `DEFAULT_SCORE_WIDTH`)

### コーディングスタイル
- 2スペースのインデント
- セミコロンは必須
- 文字列はシングルクォートを使用
- 型注釈は明示的に記述
- `any`型の使用は避ける
- 非同期処理はPromiseまたはasync/awaitを使用
- コメントは日本語で記述

### Reactコンポーネント
- 関数コンポーネントを使用
- Hooksを適切に活用
- `React.FC`タイプの使用は避ける
- 子コンポーネントへのpropsは明示的に型定義
- 状態管理にはZustandを使用

## Tailwind CSS スタイル

### 基本方針
- TailwindCSSのユーティリティクラスを優先的に使用する
- カスタムCSSは最小限に抑える
- レスポンシブデザインを考慮したクラス設計を行う
- ダークモードにも対応する

### スタイリングの優先順位
1. TailwindCSSのユーティリティクラス
2. TailwindCSSの@applyディレクティブを使用したカスタムクラス
3. インラインスタイル（最小限に抑える）

### 色の使用
- 直接的な色名（例: `text-red-500`）の使用は避け、セマンティックな命名を使用
- ダークモード対応のためのクラス(例: `dark:text-white`)を適切に設定

## 開発ワークフロー

- 新機能の追加やバグ修正は必ずブランチを切って作業
- コミットメッセージは具体的に記述
- プルリクエストによるコードレビューを経てマージ
- Storybook上で視覚的なテストを実施

### コミットメッセージのフォーマット
```
[タイプ] 概要

詳細な説明
```

タイプ:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: コードスタイル
- refactor: リファクタリング
- test: テスト関連
- chore: その他

## テストとアクセシビリティ

### テスト
- コンポーネントごとにテストを作成
- Storybookのストーリーを各コンポーネントに作成

### アクセシビリティ
- WAI-ARIAに準拠した実装
- キーボード操作に対応
- 色のコントラスト比に注意
- 適切なフォーカス状態のスタイルを設定
- スクリーンリーダー用のクラス(例: `sr-only`)を必要に応じて使用

## 国際化

- 全てのUI文字列はi18nextを使用して国際化
- 日本語と英語の両方をサポート

## ライセンス

本モジュールを本格的に商用利用する場合、特に、プ譜が収益やユーザーの獲得における主要な要素となるような事業、製品、サービス等を展開したい場合は、連絡窓口（info@gotolab.co.jp）まで連絡してください。