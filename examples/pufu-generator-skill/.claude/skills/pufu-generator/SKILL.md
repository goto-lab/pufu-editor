---

## name: pufu-generator

description: |
  プ譜（プロジェクト譜）のJSONデータを既存のドキュメントから自動生成するスキル。
  使用するタイミング：
  (1) PowerPoint、Excel、PDF、テキストファイルからプ譜を生成したい
  (2) 複数のドキュメントを解析してプ譜の要素を抽出したい
  (3) プロジェクト関連資料からプ譜を自動作成したい
  (4) プ譜エディタ（pufu-editor）で使えるJSON形式でエクスポートしたい
  (5) 時系列で複数ステップがあるプロジェクトの複数局面プ譜を生成したい
  (6) 偶数局面を振り返り局面として、計画と振り返りのペアでプ譜を生成したい

# プ譜ジェネレーター (Pufu Generator)

既存のドキュメント（pptx, xlsx, pdf, docx, txt, md）からプ譜エディタ互換のJSONデータを自動生成する。
単一局面のプ譜だけでなく、時系列で複数局面のプ譜を生成可能。偶数局面は振り返り局面として自動構成される。

## ワークフロー

```
入力ファイル → 読み取り・分析 → プ譜JSON生成 → サマリ表示 → (任意)画像生成
```

**処理フロー：**

1. **読み取り・分析**: 入力ファイルを直接読み取り、プ譜の各要素を抽出する
   - 対応形式: pptx, xlsx, pdf, docx, txt, md
   - 時系列のステップがある場合は局面を検出し、複数局面モードで処理
2. **プ譜JSON生成**: 抽出した要素からpufu-editor互換のJSONを生成し、ファイルに保存
   - 単一局面: `ProjectScoreModel` 形式
   - 複数局面: `ProjectScoreMap` 形式（局面ごとの個別JSONも出力）
3. **サマリ表示**: 生成結果の概要をユーザーに表示
4. **画像生成**（オプション）: Playwrightスクリプトでプ譜をPNG画像に変換

> **注意**: ファイルの読み取り・要素抽出・統合はClaude自身が直接行う。
> Pythonスクリプトは最終成果物の生成（JSON整形・画像キャプチャ）にのみ使用する。

### 作業ディレクトリ構成

各ステップの成果物をフォルダに格納する。処理開始時にディレクトリを作成すること。

```
{work_dir}/
├── 01_analysis/     # Step 1: 読み取り・分析の結果
│   └── analysis.json          # 抽出した要素の分析結果
├── 02_output/       # Step 2: プ譜JSON（最終成果物）
│   ├── pufu.json              # 単一局面の場合
│   ├── pufu_all_phases.json   # 複数局面の場合（ProjectScoreMap）
│   ├── pufu_phase1.json       # 複数局面の場合（個別局面）
│   ├── pufu_phase2.json
│   └── ...
└── 03_image/        # Step 4: 画像（オプション）
    ├── pufu.png               # 単一局面の場合
    ├── pufu_phase1.png        # 複数局面の場合（局面ごと）
    ├── pufu_phase2.png
    └── ...
```

**01_analysis/analysis.json の形式（単一局面）：**

```json
{
  "source_files": ["project_plan.pdf"],
  "mode": "single",
  "gainingGoal": "抽出した獲得目標テキスト",
  "winCondition": "抽出した勝利条件テキスト",
  "purposes": [
    {
      "text": "中間目的テキスト",
      "measures": [
        {"text": "施策テキスト", "color": "red"}
      ]
    }
  ],
  "elements": {
    "people": "抽出したテキスト",
    "money": "抽出したテキスト",
    "time": "抽出したテキスト",
    "quality": "抽出したテキスト",
    "businessScheme": "抽出したテキスト",
    "environment": "抽出したテキスト",
    "rival": "抽出したテキスト",
    "foreignEnemy": "抽出したテキスト"
  }
}
```

**01_analysis/analysis.json の形式（複数局面）：**

```json
{
  "source_files": ["project_plan.pdf"],
  "mode": "multi_phase",
  "phases": [
    {
      "number": 1,
      "type": "plan",
      "label": "第1局面：企画・準備",
      "gainingGoal": "...",
      "winCondition": "...",
      "purposes": [...],
      "elements": {...}
    },
    {
      "number": 2,
      "type": "retrospective",
      "label": "第1局面：振り返り",
      "gainingGoal": "...",
      "winCondition": "...",
      "purposes": [...],
      "elements": {...},
      "retrospective": {
        "winCondition_achievement": "達成度の評価",
        "purpose_results": [...]
      }
    }
  ]
}
```

## プ譜の構成要素

プ譜は以下の要素で構成される：

| 要素    | 説明                      | JSONキー         |
| ----- | ----------------------- | -------------- |
| 獲得目標  | プロジェクトの目標・ミッション         | `gainingGoal`  |
| 勝利条件  | プロジェクト成功の判断基準・評価指標      | `winCondition` |
| 中間目的  | 勝利条件達成のための「あるべき状態」（複数可） | `purposes`     |
| 施策    | 各中間目的を実現するための具体的行動（複数可） | `measures`     |
| 廟算八要素 | プロジェクトの前提条件・リソース        | `elements`     |

### 廟算八要素の詳細

| 要素    | 説明                 | JSONキー           |
| ----- | ------------------ | ---------------- |
| ひと    | 価値観、実績、メンバー、顧客など   | `people`         |
| お金    | 予算、目標、利益、コストなど     | `money`          |
| 時間    | スケジュール、作業時間など      | `time`           |
| クオリティ | 満足感、仕上がり感、技術など     | `quality`        |
| 商流/座組 | ビジネスモデル、価値やお金の流れなど | `businessScheme` |
| 環境    | 業界、組織、国・地域など       | `environment`    |
| ライバル  | 同じ成果や資源を取り合う存在     | `rival`          |
| 外敵    | 目的を積極的に邪魔するヒトやコト   | `foreignEnemy`   |

### 施策の色分け

施策には5種類の色があり、それぞれ意味が異なる：

| 色        | 意味                       |
| -------- | ------------------------ |
| `white`  | 標準的なアクション                |
| `red`    | 目標達成のために、当然取り組むべき主なアクション |
| `green`  | 面倒でも、やらなければならないこと        |
| `blue`   | 後々発生するかもしれない問題への予防策      |
| `yellow` | 人、お金、時間等の資源に余裕があればやりたいこと |

## 局面（フェーズ）の概念

プロジェクトが時系列で複数のステップを持つ場合、各ステップを「局面」として分割し、局面ごとに独立したプ譜を生成する。

### 局面の種類

- **奇数局面（1, 3, 5...）**: 計画局面 — その時点での計画・目標・施策を記述
- **偶数局面（2, 4, 6...）**: 振り返り局面 — 前局面の結果を評価し、実績・変化を反映

### 計画局面と振り返り局面の違い

| 要素 | 計画局面（奇数） | 振り返り局面（偶数） |
|------|----------------|------------------|
| 獲得目標 | その局面での目標 | 同じ（または修正後の目標） |
| 勝利条件 | 達成すべき基準 | 実際に達成できたかの評価 |
| 中間目的 | あるべき状態 | 実際になれた状態／なれなかった状態 |
| 施策 | やること（計画） | やったこと（実績）、色の変化あり |
| 施策の色 | 推定による色分け | 実績に基づく色の再評価 |
| コメント | 空または注意事項 | 振り返りコメント（成果・課題・学び） |
| 廟算八要素 | 前提条件・リソース | 実際の状況・変化した条件 |

### 振り返り局面でのコメント色の使い方

| コメント色 | 振り返りでの意味 |
|-----------|---------------|
| `green` | 達成・成功した項目 |
| `red` | 未達・課題が残った項目 |
| `blue` | 情報・メモ（デフォルト） |

### 局面の検出

入力ドキュメントから以下のキーワードで時系列の区切りを検出する：

- フェーズ、Phase、段階、ステージ、ステップ
- 第N期、Q1/Q2/Q3/Q4、〜月、前半/後半
- マイルストーン、リリース、イテレーション、スプリント

**分割ルール：**

1. 明示的な時系列区切りがある場合 → その区切りで分割
2. 時系列区切りがない場合 → ユーザーに局面数を確認するか、単一局面として処理
3. 各計画局面（奇数）の後に、対応する振り返り局面（偶数）を生成
4. 振り返りのソースがない場合 → 計画局面の構造をコピーし、コメント欄を空にする

### 複数局面の出力形式

pufu-editorの `ProjectScoreMap` 形式で出力する（キー→ProjectScoreModelのマップ）：

```json
{
  "phase1": { /* 第1局面（計画） */ },
  "phase2": { /* 第2局面（振り返り） */ },
  "phase3": { /* 第3局面（計画） */ },
  "phase4": { /* 第4局面（振り返り） */ }
}
```

## Step 1: 読み取り・分析

入力ファイルを直接読み取り、プ譜の各要素を抽出する。

**対応ファイル形式：**

- `.pptx`: スライドごとにセクション分け、タイトルと内容を抽出
- `.xlsx`: シートごとにテーブル形式で抽出
- `.pdf`: テキスト抽出
- `.docx`: 見出し構造を保持して読み取り
- `.txt/.md`: そのまま読み取り

**抽出する情報：**

- 目標・ゴールに関する記述 → 獲得目標
- 成功条件・KPIに関する記述 → 勝利条件
- 状態目標・中間ゴール → 中間目的
- アクション・タスク → 施策（色も推定）
- リソース・制約条件 → 廟算八要素
- 時系列区切り → 局面の検出（複数局面モード）

**出力先：** `{work_dir}/01_analysis/analysis.json`

> Claudeが直接ファイルを読めない形式（pptx, xlsxなど）の場合のみ、
> 補助スクリプト `scripts/convert_to_markdown.py` を使用してマークダウンに変換する。

## Step 2: プ譜JSON生成

抽出した要素からpufu-editor互換のJSONファイルを生成する。

**出力先：**

- 単一局面: `{work_dir}/02_output/pufu.json`
- 複数局面: `{work_dir}/02_output/pufu_all_phases.json`（統合）、`{work_dir}/02_output/pufu_phase{N}.json`（個別）

> JSONの整形・UUID生成に `scripts/generate_pufu_json.py` を使用できるが、
> Claudeが直接JSON構造を組み立ててファイルに書き出しても良い。

**プ譜JSON形式（pufu-editor準拠）：**

```json
{
  "winCondition": {
    "uuid": "unique-id-1",
    "text": "[勝利条件]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "gainingGoal": {
    "uuid": "unique-id-2",
    "text": "[獲得目標]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "purposes": [
    {
      "uuid": "unique-id-3",
      "text": "[中間目的]のテキスト",
      "comment": {
        "color": "blue",
        "text": ""
      },
      "measures": [
        {
          "uuid": "unique-id-4",
          "text": "[施策]のテキスト",
          "comment": {
            "color": "blue",
            "text": ""
          },
          "color": "white"
        }
      ]
    }
  ],
  "elements": {
    "people": {
      "uuid": "unique-id-5",
      "text": "[ひと]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "money": {
      "uuid": "unique-id-6",
      "text": "[お金]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "time": {
      "uuid": "unique-id-7",
      "text": "[時間]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "quality": {
      "uuid": "unique-id-8",
      "text": "[クオリティ]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "businessScheme": {
      "uuid": "unique-id-9",
      "text": "[商流/座組]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "environment": {
      "uuid": "unique-id-10",
      "text": "[環境]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "rival": {
      "uuid": "unique-id-11",
      "text": "[ライバル]のテキスト",
      "comment": { "color": "blue", "text": "" }
    },
    "foreignEnemy": {
      "uuid": "unique-id-12",
      "text": "[外敵]のテキスト",
      "comment": { "color": "blue", "text": "" }
    }
  }
}
```

## Step 3: サマリ表示

生成されたJSONの概要をユーザーに表示する。

**表示内容：**

- 獲得目標（要約）
- 勝利条件（要約）
- 中間目的の数と施策の数
- 施策の色別内訳
- 廟算八要素の充足状況
- プ譜エディタでの表示用リンク（[https://goto-lab.github.io/pufu-editor/](https://goto-lab.github.io/pufu-editor/) でJSONをインポート可能）

**複数局面モードの追加表示内容：**

- 局面一覧（局面番号、種類、ラベル）
- 局面ごとのサマリ（獲得目標、勝利条件、中間目的数、施策数）
- 振り返り局面の達成状況（コメント色の集計）

## Step 4: 画像生成（オプション）

Playwrightを使用してプ譜JSONからPNG画像を生成する。

**処理フロー：**

1. Storybookのiframeページ（Example1ストーリー）を開く
2. Importモーダル経由でプ譜JSONデータをロード
3. レンダリング完了後、`#score-{key}` 要素のスクリーンショットを取得
4. PNG画像として保存

**使用方法：**

**出力先：**

- 単一局面: `{work_dir}/03_image/pufu.png`
- 複数局面: `{work_dir}/03_image/pufu_phase{N}.png`（局面ごと）

```bash
# 単一局面
python scripts/capture_pufu_image.py {work_dir}/02_output/pufu.json {work_dir}/03_image/pufu.png --storybook-url https://goto-lab.github.io/pufu-editor

# 複数局面（局面ごとに画像生成）
python scripts/capture_pufu_image.py {work_dir}/02_output/pufu_all_phases.json {work_dir}/03_image/pufu.png --storybook-url https://goto-lab.github.io/pufu-editor --multi-phase
```

**オプション：**

- `--width`: ビューポート幅（デフォルト: 1200）
- `--dark`: ダークモードで描画

**必要なライブラリ：**

```bash
pip install playwright --break-system-packages
playwright install chromium
```

## 補助スクリプト

以下のスクリプトは必要に応じて使用する。Claudeが直接処理できる場合は省略可能。

| スクリプト | 用途 | 使うタイミング |
|-----------|------|--------------|
| `scripts/convert_to_markdown.py` | ファイルをマークダウンに変換 | Claudeが直接読めない形式（pptx, xlsxなど）の場合 |
| `scripts/generate_pufu_json.py` | サマリJSONからプ譜JSONを生成 | UUID生成やJSON整形を自動化したい場合 |
| `scripts/capture_pufu_image.py` | プ譜をPNG画像にキャプチャ | 画像が必要な場合（Playwright必須） |

### generate_pufu_json.py の使い方

```bash
# 単一局面
python scripts/generate_pufu_json.py summary.json pufu.json

# 複数局面
python scripts/generate_pufu_json.py multi_phase_summary.json pufu_all_phases.json --multi-phase

# サンプル生成
python scripts/generate_pufu_json.py --sample output.json
python scripts/generate_pufu_json.py --sample-multi-phase output.json
```

## 要素抽出のヒント

### キーワードマッピング

| キーワード例             | マッピング先 |
| ------------------ | ------ |
| ゴール、目標、成果物、ミッション   | 獲得目標   |
| 成功条件、KPI、評価指標、判断基準 | 勝利条件   |
| 状態、〜になっている、〜している状態 | 中間目的   |
| タスク、アクション、実施、〜する   | 施策     |
| チーム、予算、期限、品質、競合    | 廟算八要素  |

### 施策の色の推定ルール

| 条件                | 推定される色   |
| ----------------- | -------- |
| 「必須」「絶対」「最優先」を含む  | `red`    |
| 「面倒」「複雑」「調整」を含む   | `green`  |
| 「リスク」「予防」「備え」を含む  | `blue`   |
| 「余裕があれば」「できれば」を含む | `yellow` |
| 上記以外              | `white`  |

## 参照ファイル

- **プ譜スキーマ詳細**: [references/pufu-schema.md](references/pufu-schema.md)
- **抽出ルール詳細**: [references/extraction-rules.md](references/extraction-rules.md)

## 注意事項

- UUIDは一意のIDを生成すること（短縮UUID形式を推奨）
- 自動抽出はあくまで候補の提示。最終的な内容は人間がレビュー・調整すること
- プ譜エディタ（[https://goto-lab.github.io/pufu-editor/）でJSONをインポートして確認可能](https://goto-lab.github.io/pufu-editor/）でJSONをインポートして確認可能)
- 施策の色は自動推定だが、重要度に応じて手動で調整すること
- 複数局面モードでは、振り返り局面のコメントは特に重要。達成項目は`green`、未達項目は`red`で色分けする
- 振り返り局面のソースドキュメントがない場合は、計画局面の構造をコピーしてコメント欄を空にし、ユーザーが手動で記入できるようにする
