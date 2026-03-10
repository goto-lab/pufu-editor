# プ譜ジェネレーター (pufu-generator)

既存のドキュメント（PowerPoint、Excel、PDF、Word、テキスト）からプ譜エディタ互換のJSONデータを自動生成するスキルです。

## 概要

プ譜（プロジェクト譜）は、プロジェクトの全体像を1枚で可視化するためのフレームワークです。このスキルを使うことで、既存のプロジェクト資料からプ譜のJSON形式データを自動生成できます。

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

または

```

このプロジェクト資料からプ譜のJSONを作成してください

```

### 処理フロー

```

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 入力ファイル │ → │ マークダウン │ → │ 要素抽出    │ → │ JSON生成    │ → │ 画像生成    │
│ (pptx等)    │    │ 変換        │    │             │    │             │    │ (オプション) │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

```

1. **構造解析**: 各ファイルをマークダウン形式に変換
2. **要素抽出**: マークダウンからプ譜要素を抽出
3. **サマリ生成**: 複数ファイルの情報を統合
4. **JSON生成**: pufu-editor互換形式で出力
5. **サマリ表示**: 生成結果の概要を表示
6. **画像生成**（オプション）: Playwrightでプ譜をPNG画像に変換

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


## 出力形式

生成されるJSONはpufu-editor準拠の形式です：

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

## スクリプトの使い方（上級者向け）

### ドキュメント変換スクリプト

```bash
python scripts/convert_to_markdown.py <入力パス> <出力ディレクトリ>

# 例: アップロードされたファイルを変換
python scripts/convert_to_markdown.py /mnt/user-data/uploads /home/claude/pufu_work/01_markdown

```

### プ譜JSON生成スクリプト

```bash
python scripts/generate_pufu_json.py <サマリJSONパス> <出力パス>

# 例: サマリからプ譜JSONを生成
python scripts/generate_pufu_json.py /home/claude/pufu_work/03_summary/summary.json /home/claude/pufu_work/04_output/pufu.json

# サンプルサマリを作成
python scripts/generate_pufu_json.py --sample /home/claude/pufu_work/sample_summary.json

```

### プ譜画像生成スクリプト

```bash
python scripts/capture_pufu_image.py <プ譜JSONパス> <出力画像パス> [オプション]

# 例: GitHub PagesのStorybookを使用（インストール不要）
python scripts/capture_pufu_image.py pufu.json pufu.png --storybook-url https://goto-lab.github.io/pufu-editor

# 例: ローカルStorybookを使用
python scripts/capture_pufu_image.py pufu.json pufu.png --storybook-url http://localhost:6006

# 例: ダークモード・幅指定
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
    └── pufu_template.json       # プ譜JSONテンプレート

```

## 注意事項

- **自動抽出は候補の提示です**: 最終的な内容は人間がレビュー・調整してください
- **施策の色は自動推定です**: 重要度に応じて手動で調整してください
- **複数ファイルの統合**: 情報の重複・矛盾は適切に処理されますが、確認をお勧めします

## 参考リンク

- [プ譜エディタ（デモ）](https://goto-lab.github.io/pufu-editor/)
- [pufu-editor GitHub](https://github.com/goto-lab/pufu-editor)
- [プ譜とは何か](https://scrapbox.io/ProjectScore/%E3%83%97%E8%AD%9C%E3%81%A8%E3%81%AF%E4%BD%95%E3%81%8B%EF%BC%9A%E3%81%9D%E3%81%AE%E6%88%90%E3%82%8A%E7%AB%8B%E3%81%A1%E3%81%A8%E5%9F%BA%E6%9C%AC)
- [書籍「紙1枚に書くだけでうまくいく プロジェクト進行の技術が身につく本」](https://www.shoeisha.co.jp/book/detail/9784798164106)

## ライセンス

このスキルはBSD-3-Clauseライセンスで提供されます。