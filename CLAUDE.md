# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

プ譜エディター（Pufu Editor）は、書籍『予定通り進まないプロジェクトの進め方』に基づいたプロジェクト譜（プ譜）を編集・表示するためのWebコンポーネントライブラリです。NPMパッケージ `@goto-lab/pufu-editor` として公開されています。

## よく使用するコマンド

### ビルドと開発
```bash
npm run build              # ライブラリのビルド (clean + tsc + copy + build:css)
npm run clean              # distディレクトリのクリーン
npm run lint               # srcディレクトリでESLintを実行
npm run fix:lint           # ESLintの問題を自動修正
```

### Storybook（主要な開発環境）
```bash
npm run storybook          # Storybookの開発サーバーをポート6006で起動
npm run storybook-build    # 静的Storybookをビルド
npm run storybook-test     # test-runnerでビジュアルテストを実行
npm run storybook-test-coverage  # カバレッジレポート付きでテストを実行
npm run storybook-build-test     # Storybookをビルドしてテスト
```

### テスト
```bash
npm run storybook-test     # 主要なテストコマンド（Storybook経由のビジュアルテスト）
npm run storybook-test-coverage  # カバレッジ付きで実行
```

### 型インターフェース生成
```bash
npm run model-ti           # models.tsからTypeScriptインターフェースを生成
```

## アーキテクチャ

### コアデータモデル
プロジェクトは `ProjectScoreModel` を中心としており、これがプロジェクト譜（プ譜）を表現します：
- **WinCondition**（勝利条件）：成功基準
- **GainingGoal**（獲得目標）：プロジェクトの目的・ミッション
- **IntermediatePurpose**（中間目的）：勝利条件達成のための中間目標
- **Measures**（施策）：各中間目的のための具体的行動
- **EightElements**（廟算八要素）：8つのリソース・条件要素（ひと、お金、時間、クオリティ、商流/座組、環境、ライバル、外敵）

### コンポーネント階層
- `ProjectScore`：メインコンテナコンポーネント
- `ObjectiveBox`：WinConditionとGainingGoal用
- `IntermediatePurpose`：中間目的用
- `Measure`：カラーコーディング付きの個別アクション項目（white/red/green/blue/yellow）
- `EightElements`：リソース管理セクション
- `Comment`：フィードバック・コメントシステム

### 状態管理
- Zustandを使用した状態管理（`src/lib/store.ts`）
- グローバル状態でユニークキーによる複数のプロジェクト譜を追跡
- エクスポート関数：`getScoreJson()`、`downloadScore()`、`setScore()`

### 国際化
- 日本語・英語サポートのためのi18next
- 言語ファイルは `src/i18n/locales/` に配置
- テキストサイズのバリエーション：small/base/large

### スタイリング
- コンポーネント固有スタイル用のCSS ModulesとTailwindCSS
- `dark:` クラスによるダークモードサポート
- モバイルレスポンシブデザイン
- 施策の種類と優先度のカラーコーディング

## 開発規約

### コードスタイル（.cursor/rulesより）
- 厳密な型付けのTypeScript、`any`の使用を避ける
- Hooksを使った関数型Reactコンポーネント
- コンポーネントはPascalCase、関数・変数はcamelCase
- インターフェースには `I` プレフィックス（例：`IScoreData`）
- 定数はUPPER_SNAKE_CASE
- 2スペースインデント、セミコロン必須、文字列はシングルクォート
- コメントは日本語で記述

### ファイル構成
- `/src/components/` - `.module.css` スタイル付きReactコンポーネント
- `/src/lib/` - 共有ユーティリティ、モデル、フック、ストア
- `/src/stories/` - 各コンポーネントのStorybookストーリー
- `/src/tests/` - Storybook test-runnerを使用したテストファイル
- `/src/i18n/` - 国際化設定とロケール

### テストアプローチ
- `@storybook/test-runner` を使ったStorybookでの主要テスト
- Storybookワークフローに組み込まれたビジュアルリグレッションテスト
- ロールベースセレクタを使用したコンポーネントテスト（例：`role="purpose"`）
- カバレッジレポートは `/coverage/storybook/` に生成

### エクスポート戦略
ライブラリパッケージとして以下をエクスポート：
- メインコンポーネント（`ProjectScore`、`Comment`、`Measure`等）
- ユーティリティ関数（`getScoreJson`、`downloadScore`、`setScore`）
- TypeScriptモデルとインターフェース
- `dist/index.css` 経由のCSSバンドル

### コミットフォーマット
```
[タイプ] 概要

詳細な説明
```
タイプ：feat、fix、docs、style、refactor、test、chore