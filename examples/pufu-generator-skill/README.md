# プ譜ジェネレーター (pufu-generator)

既存のドキュメント（PowerPoint、Excel、PDF、Word、テキスト）からプ譜エディタ互換のJSONデータを自動生成するスキルです。

## 概要

プ譜（プロジェクト譜）は、プロジェクトの全体像を1枚で可視化するためのフレームワークです。このスキルを使うことで、既存のプロジェクト資料からプ譜のJSON形式データを自動生成できます。

時系列で複数のステップがあるプロジェクトでは、**複数局面のプ譜**を生成可能。奇数局面は計画、偶数局面は振り返りとして自動構成されます。

生成されたJSONは [プ譜エディタ](https://goto-lab.github.io/pufu-editor/) でインポートして編集・表示できます。

## 対応ファイル形式

| 形式         | 拡張子             | 説明            |
| ---------- | --------------- | ------------- |
| PowerPoint | `.pptx`         | スライドごとにテキスト抽出 |
| Excel      | `.xlsx`, `.xls` | シートごとにテーブル抽出  |
| PDF        | `.pdf`          | テキストとテーブルを抽出  |
| Word       | `.docx`         | 見出し構造を保持して抽出  |
| テキスト       | `.txt`, `.md`   | そのまま使用        |

## 使い方

### 基本的な使い方

Claudeに以下のように依頼してください：

```
アップロードしたファイルからプ譜を生成してください
```

複数局面のプ譜を生成する場合：

```
このプロジェクト資料から複数局面のプ譜を生成してください。各フェーズの振り返りも含めてください。
```

### 処理フロー

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 入力ファイル │ → │ 読み取り    │ → │ JSON生成    │ → │ 画像生成    │
│ (pdf等)     │    │ ・分析      │    │ ・サマリ表示 │    │ (オプション) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

1. **読み取り・分析**: 入力ファイルを直接読み取り、プ譜要素を抽出（複数局面の検出含む） → `01_analysis/`
2. **プ譜JSON生成**: pufu-editor互換形式で出力 → `02_output/`
3. **サマリ表示**: 生成結果の概要を表示
4. **画像生成**（オプション）: Playwrightでプ譜をPNG画像に変換 → `03_image/`

### 作業ディレクトリ構成

各ステップの成果物はフォルダに格納されます：

```
{work_dir}/
├── 01_analysis/     # Step 1: 読み取り・分析の結果
│   └── analysis.json
├── 02_output/       # Step 2: プ譜JSON（最終成果物）
│   ├── pufu.json              # 単一局面
│   ├── pufu_all_phases.json   # 複数局面（ProjectScoreMap）
│   ├── pufu_phase1.json       # 複数局面（個別）
│   └── ...
└── 03_image/        # Step 4: 画像（オプション）
    ├── pufu.png               # 単一局面
    ├── pufu_phase1.png        # 複数局面（局面ごと）
    └── ...
```

## プ譜の構成要素

| 要素    | 説明                 | JSONキー         |
| ----- | ------------------ | -------------- |
| 獲得目標  | プロジェクトの目標・ミッション    | `gainingGoal`  |
| 勝利条件  | 成功の判断基準・評価指標       | `winCondition` |
| 中間目的  | 勝利条件達成のための「あるべき状態」 | `purposes`     |
| 施策    | 中間目的を実現するための具体的行動  | `measures`     |
| 廟算八要素 | プロジェクトの前提条件・リソース   | `elements`     |

### 廟算八要素

| 要素    | 説明               | JSONキー           |
| ----- | ---------------- | ---------------- |
| ひと    | 価値観、実績、メンバー、顧客   | `people`         |
| お金    | 予算、目標、利益、コスト     | `money`          |
| 時間    | スケジュール、作業時間      | `time`           |
| クオリティ | 満足感、仕上がり感、技術     | `quality`        |
| 商流/座組 | ビジネスモデル、価値の流れ    | `businessScheme` |
| 環境    | 業界、組織、国・地域       | `environment`    |
| ライバル  | 同じ成果や資源を取り合う存在   | `rival`          |
| 外敵    | 目的を積極的に邪魔するヒトやコト | `foreignEnemy`   |

### 施策の色分け

施策には5種類の色があり、重要度や性質を表します：

| 色         | 記号  | 意味                      |
| --------- | --- | ----------------------- |
| 🔴 red    | ●   | 目標達成のために当然取り組むべき主なアクション |
| ⚪ white   | ○   | 標準的なアクション               |
| 🟢 green  | ■   | 面倒でも、やらなければならないこと       |
| 🔵 blue   | ◆   | 後々発生するかもしれない問題への予防策     |
| 🟡 yellow | ★   | 資源に余裕があればやりたいこと         |

## 複数局面（フェーズ）対応

### 局面の概念

プロジェクトが時系列で複数のステップを持つ場合、各ステップを「局面」として分割し、局面ごとに独立したプ譜を生成します。

- **奇数局面（1, 3, 5...）**: 計画局面 — その時点での計画・目標・施策
- **偶数局面（2, 4, 6...）**: 振り返り局面 — 前局面の結果を評価し、実績・変化を反映

### 計画局面と振り返り局面の違い

| 要素 | 計画局面（奇数） | 振り返り局面（偶数） |
|------|----------------|------------------|
| 獲得目標 | その局面での目標 | 同じ（または修正後の目標） |
| 勝利条件 | 達成すべき基準 | 実際に達成できたかの評価 |
| 中間目的 | あるべき状態 | 実際になれた状態／なれなかった状態 |
| 施策 | やること（計画） | やったこと（実績）、色の変化あり |
| コメント | 空または注意事項 | 振り返りコメント（成果・課題・学び） |
| 廟算八要素 | 前提条件・リソース | 実際の状況・変化した条件 |

### 振り返り局面でのコメント色

| コメント色 | 振り返りでの意味 |
|-----------|---------------|
| 🟢 green | 達成・成功した項目 |
| 🔴 red | 未達・課題が残った項目 |
| 🔵 blue | 情報・メモ（デフォルト） |

### 出力形式

複数局面の場合、`ProjectScoreMap` 形式で出力されます：

```json
{
  "phase1": { "winCondition": {...}, "gainingGoal": {...}, "purposes": [...], "elements": {...} },
  "phase2": { "winCondition": {...}, "gainingGoal": {...}, "purposes": [...], "elements": {...} },
  "phase3": { "winCondition": {...}, "gainingGoal": {...}, "purposes": [...], "elements": {...} },
  "phase4": { "winCondition": {...}, "gainingGoal": {...}, "purposes": [...], "elements": {...} }
}
```

## 単一局面の出力形式

単一局面の場合は `ProjectScoreModel` 形式です：

```json
{
  "winCondition": {
    "uuid": "er2ugQkdnw5WY2ceSGqVNV",
    "text": "勝利条件のテキスト",
    "comment": { "color": "blue", "text": "" }
  },
  "gainingGoal": {
    "uuid": "2MfGeLrm8PQaaVe3v3ABsV",
    "text": "獲得目標のテキスト",
    "comment": { "color": "blue", "text": "" }
  },
  "purposes": [
    {
      "uuid": "9fov1Hdokf2NgsPkWgHatH",
      "text": "中間目的のテキスト",
      "comment": { "color": "blue", "text": "" },
      "measures": [
        {
          "uuid": "cgmABssH3uNG8k5cdato5a",
          "text": "施策のテキスト",
          "comment": { "color": "blue", "text": "" },
          "color": "white"
        }
      ]
    }
  ],
  "elements": {
    "people": { "uuid": "...", "text": "...", "comment": {...} },
    "money": { "uuid": "...", "text": "...", "comment": {...} },
    "time": { "uuid": "...", "text": "...", "comment": {...} },
    "quality": { "uuid": "...", "text": "...", "comment": {...} },
    "businessScheme": { "uuid": "...", "text": "...", "comment": {...} },
    "environment": { "uuid": "...", "text": "...", "comment": {...} },
    "rival": { "uuid": "...", "text": "...", "comment": {...} },
    "foreignEnemy": { "uuid": "...", "text": "...", "comment": {...} }
  }
}
```

## プ譜エディタでの利用

1. [プ譜エディタ](https://goto-lab.github.io/pufu-editor/) にアクセス
2. 「インポート」ボタンをクリック
3. 生成されたJSONファイルを選択
4. プ譜が表示され、編集可能になります

> 複数局面の `ProjectScoreMap` 形式もそのままインポートできます。

## 補助スクリプト（上級者向け）

以下のスクリプトは必要に応じて使用します。Claudeが直接処理できる場合は省略可能です。

| スクリプト | 用途 | 使うタイミング |
|-----------|------|--------------|
| `convert_to_markdown.py` | ファイルをマークダウンに変換 | Claudeが直接読めない形式の場合 |
| `generate_pufu_json.py` | サマリJSONからプ譜JSONを生成 | UUID生成やJSON整形を自動化したい場合 |
| `capture_pufu_image.py` | プ譜をPNG画像にキャプチャ | 画像が必要な場合（Playwright必須） |

### ドキュメント変換スクリプト

```bash
python scripts/convert_to_markdown.py <入力パス> <出力ディレクトリ>
```

### プ譜JSON生成スクリプト

```bash
# 単一局面
python scripts/generate_pufu_json.py <サマリJSONパス> <出力パス>

# 複数局面
python scripts/generate_pufu_json.py <サマリJSONパス> <出力パス> --multi-phase

# サンプルサマリを作成
python scripts/generate_pufu_json.py --sample <出力パス>
python scripts/generate_pufu_json.py --sample-multi-phase <出力パス>
```

### プ譜画像生成スクリプト

```bash
# 単一局面
python scripts/capture_pufu_image.py pufu.json pufu.png --storybook-url https://goto-lab.github.io/pufu-editor

# 複数局面（局面ごとに画像生成）
python scripts/capture_pufu_image.py pufu_all_phases.json pufu.png --storybook-url https://goto-lab.github.io/pufu-editor --multi-phase

# ダークモード・幅指定
python scripts/capture_pufu_image.py pufu.json pufu.png --storybook-url https://goto-lab.github.io/pufu-editor --dark --width 1400
```

### 必要なPythonライブラリ

```bash
# PowerPoint処理
pip install python-pptx --break-system-packages

# Excel処理
pip install openpyxl --break-system-packages

# PDF処理（どちらか一方）
pip install pdfplumber --break-system-packages
# または
pip install PyPDF2 --break-system-packages

# Word処理
pip install python-docx --break-system-packages

# 画像生成（オプション）
pip install playwright --break-system-packages
playwright install chromium
```

## ファイル構成

```
pufu-generator/
├── SKILL.md                      # スキル定義（メイン）
├── references/
│   ├── pufu-schema.md           # プ譜JSON形式の詳細仕様
│   └── extraction-rules.md      # 要素抽出ルール
├── scripts/
│   ├── convert_to_markdown.py   # ドキュメント変換スクリプト
│   ├── generate_pufu_json.py    # JSON生成スクリプト
│   └── capture_pufu_image.py    # 画像生成スクリプト（Playwright）
└── assets/
    ├── pufu_template.json              # 単一局面テンプレート
    └── pufu_multi_phase_template.json  # 複数局面テンプレート
```

## 注意事項

- **自動抽出は候補の提示です**: 最終的な内容は人間がレビュー・調整してください
- **施策の色は自動推定です**: 重要度に応じて手動で調整してください
- **複数局面の振り返り**: 振り返り局面のコメントは特に重要です。達成項目は`green`、未達項目は`red`で色分けされます
- **振り返りのソースがない場合**: 計画局面の構造がコピーされ、コメント欄が空で生成されます。手動で記入してください

## 参考リンク

- [プ譜エディタ（デモ）](https://goto-lab.github.io/pufu-editor/)
- [pufu-editor GitHub](https://github.com/goto-lab/pufu-editor)
- [プ譜とは何か](https://scrapbox.io/ProjectScore/%E3%83%97%E8%AD%9C%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B%EF%BC%9A%E3%81%9D%E3%81%AE%E6%88%90%E3%82%8A%E7%AB%8B%E3%81%A1%E3%81%A8%E5%9F%BA%E6%9C%AC)
- [書籍「紙1枚に書くだけでうまくいく プロジェクト進行の技術が身につく本」](https://www.shoeisha.co.jp/book/detail/9784798164106)

## ライセンス

このスキルはBSD-3-Clauseライセンスで提供されます。
