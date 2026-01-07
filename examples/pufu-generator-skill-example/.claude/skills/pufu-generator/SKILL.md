---

## name: pufu-generator

description: |  
  プ譜（プロジェクト譜）のJSONデータを既存のドキュメントから自動生成するスキル。  
  使用するタイミング：  
  (1) PowerPoint、Excel、PDF、テキストファイルからプ譜を生成したい  
  (2) 複数のドキュメントを解析してプ譜の要素を抽出したい  
  (3) プロジェクト関連資料からプ譜を自動作成したい  
  (4) プ譜エディタ（pufu-editor）で使えるJSON形式でエクスポートしたい

# プ譜ジェネレーター (Pufu Generator)

既存のドキュメント（pptx, xlsx, pdf, docx, txt, md）からプ譜エディタ互換のJSONデータを自動生成する。

## ワークフロー概要

```
入力ファイル → 構造解析 → マークダウン化 → プ譜要素抽出 → サマリ生成 → JSON出力 → サマリ表示
```

**処理フロー：**

1. **構造解析**: 各ファイルをマークダウン形式に変換
2. **要素抽出**: マークダウンからプ譜要素を抽出し、元ファイルごとに抽出ファイルを作成
3. **サマリ生成**: 複数の抽出ファイルを統合してサマリファイルを作成
4. **JSON生成**: サマリからプ譜エディタ互換のJSONを生成
5. **表示**: プ譜エディタでJSONファイルのサマリを表示

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


## Step 1: 構造解析とマークダウン変換

入力ファイルの種類に応じて解析し、マークダウンに変換する。

**対応ファイル形式：**

- `.pptx`: スライドごとにセクション分け、タイトルと内容を抽出
- `.xlsx`: シートごとにテーブル形式で抽出
- `.pdf`: テキスト抽出（pdfplumberまたはPyPDF2を使用）
- `.docx`: 見出し構造を保持してマークダウン化
- `.txt/.md`: そのまま使用（必要に応じて構造化）

**出力先：** `{work_dir}/01_markdown/{original_filename}.md`

## Step 2: プ譜要素の抽出

各マークダウンファイルからプ譜に関連する要素を抽出する。

**抽出する情報：**

- 目標・ゴールに関する記述 → 獲得目標候補
- 成功条件・KPIに関する記述 → 勝利条件候補
- 状態目標・中間ゴール → 中間目的候補
- アクション・タスク → 施策候補（色も推定）
- リソース・制約条件 → 廟算八要素候補

**出力先：** `{work_dir}/02_extracted/{original_filename}_extracted.json`

## Step 3: サマリファイルの生成

複数の抽出ファイルを統合し、重複を除去・統合してサマリを作成する。

**出力先：** `{work_dir}/03_summary/summary.json`

## Step 4: プ譜JSONの生成（pufu-editor互換形式）

サマリファイルからプ譜エディタ互換のJSONを生成する。

**出力先：** `{work_dir}/04_output/pufu.json`

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

## Step 5: サマリ表示

生成されたJSONの概要を表示する。

**表示内容：**

- 獲得目標（要約）
- 勝利条件（要約）
- 中間目的の数と施策の数
- 施策の色別内訳
- 廟算八要素の充足状況
- プ譜エディタでの表示用リンク（[https://goto-lab.github.io/pufu-editor/](https://goto-lab.github.io/pufu-editor/) でJSONをインポート可能）

## 使用例

### 基本的な使い方

```bash
# 1. 作業ディレクトリを作成
mkdir -p /home/claude/pufu_work/{01_markdown,02_extracted,03_summary,04_output}

# 2. ファイル変換（スクリプト使用）
python scripts/convert_to_markdown.py /mnt/user-data/uploads /home/claude/pufu_work/01_markdown

# 3. プ譜JSON生成（サマリ作成後）
python scripts/generate_pufu_json.py /home/claude/pufu_work/03_summary/summary.json /home/claude/pufu_work/04_output/pufu.json

# 4. 出力ファイルを提供
cp /home/claude/pufu_work/04_output/pufu.json /mnt/user-data/outputs/
```

### キーワードマッピング（抽出のヒント）


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

