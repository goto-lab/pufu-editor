# プ譜 JSON スキーマ詳細（pufu-editor準拠）

プ譜エディタ（pufu-editor）互換のJSON形式の詳細仕様。

## 目次

1. [基本構造](#基本構造)
2. [共通のコメント構造](#共通のコメント構造)
3. [獲得目標（gainingGoal）](#獲得目標gaininggoal)
4. [勝利条件（winCondition）](#勝利条件wincondition)
5. [中間目的（purposes）](#中間目的purposes)
6. [施策（measures）](#施策measures)
7. [廟算八要素（elements）](#廟算八要素elements)
8. [UUID生成](#uuid生成)
9. [完全なスキーマ例](#完全なスキーマ例)

## 基本構造

```typescript
interface PufuScore {
  winCondition: TextElement;      // 勝利条件
  gainingGoal: TextElement;       // 獲得目標
  purposes: Purpose[];            // 中間目的（配列）
  elements: Elements;             // 廟算八要素
}
```

## 共通のコメント構造

全ての要素はコメント機能を持つ：

```typescript
interface Comment {
  color: "blue" | "red" | "green" | "yellow" | "white";
  text: string;
}

interface TextElement {
  uuid: string;
  text: string;
  comment: Comment;
}
```

コメントのデフォルト値：
```json
{
  "color": "blue",
  "text": ""
}
```

## 獲得目標（gainingGoal）

プロジェクトの目標・ミッション。

```json
{
  "gainingGoal": {
    "uuid": "2MfGeLrm8PQaaVe3v3ABsV",
    "text": "新規ECサイトの構築",
    "comment": {
      "color": "blue",
      "text": ""
    }
  }
}
```

**書き方のポイント：**
- 具体的な成果物やゴールを記述
- 形あるモノ、対象化できるものが望ましい
- 2〜3ヶ月で作り出そうとしているものが書きやすい

## 勝利条件（winCondition）

プロジェクト成功の判断基準・評価指標。

```json
{
  "winCondition": {
    "uuid": "er2ugQkdnw5WY2ceSGqVNV",
    "text": "月間売上1000万円を達成し、3部門から継続承認を得る",
    "comment": {
      "color": "blue",
      "text": ""
    }
  }
}
```

**書き方のポイント：**
- 「どうなっていたら成功か」を明確に
- 数値目標がある場合は具体的に記述
- 定性的な条件も含めてよい

## 中間目的（purposes）

勝利条件を達成するための「あるべき状態」。配列形式で複数設定可能。

```typescript
interface Purpose {
  uuid: string;
  text: string;
  comment: Comment;
  measures: Measure[];  // この中間目的に紐づく施策
}
```

```json
{
  "purposes": [
    {
      "uuid": "9fov1Hdokf2NgsPkWgHatH",
      "text": "ユーザーが直感的に操作できる状態になっている",
      "comment": {
        "color": "blue",
        "text": ""
      },
      "measures": [...]
    },
    {
      "uuid": "6dVHgBSKhKWrrnA7DP8pYJ",
      "text": "決済システムが安定稼働している",
      "comment": {
        "color": "blue",
        "text": ""
      },
      "measures": [...]
    }
  ]
}
```

**書き方のポイント：**
- 「〜している状態」「〜になっている」という状態表現
- 通常3つ程度を推奨
- 具体的で観察可能な状態を記述

## 施策（measures）

各中間目的を実現するための具体的な行動。中間目的（purpose）の中にネストされる。

```typescript
interface Measure {
  uuid: string;
  text: string;
  comment: Comment;
  color: "white" | "red" | "green" | "blue" | "yellow";
}
```

**施策の色の意味：**

| 色 | 意味 | 使用例 |
|----|------|-------|
| `white` | 標準的なアクション | 通常のタスク |
| `red` | 目標達成のために当然取り組むべき主なアクション | 必須タスク、最優先事項 |
| `green` | 面倒でも、やらなければならないこと | 調整業務、手続き |
| `blue` | 後々発生するかもしれない問題への予防策 | リスク対策、備え |
| `yellow` | 資源に余裕があればやりたいこと | オプション、追加機能 |

```json
{
  "measures": [
    {
      "uuid": "cgmABssH3uNG8k5cdato5a",
      "text": "UIプロトタイプを作成する",
      "comment": { "color": "blue", "text": "" },
      "color": "red"
    },
    {
      "uuid": "dNmKUssH2tNG9k5cdato5a",
      "text": "ユーザビリティテストを実施する",
      "comment": { "color": "blue", "text": "" },
      "color": "white"
    },
    {
      "uuid": "aUTXd41VA9FqT36QPDWhRW",
      "text": "関係部署との調整会議を開催する",
      "comment": { "color": "blue", "text": "" },
      "color": "green"
    },
    {
      "uuid": "bUTXd41Vc3FqG36QPDWhDW",
      "text": "障害発生時のロールバック手順を整備する",
      "comment": { "color": "blue", "text": "" },
      "color": "blue"
    },
    {
      "uuid": "cUTXd42Vc4FqH37QPDWhEW",
      "text": "多言語対応を追加する",
      "comment": { "color": "blue", "text": "" },
      "color": "yellow"
    }
  ]
}
```

## 廟算八要素（elements）

プロジェクトの前提条件・リソース。8つの要素から構成される。

```typescript
interface Elements {
  people: TextElement;        // ひと
  money: TextElement;         // お金
  time: TextElement;          // 時間
  quality: TextElement;       // クオリティ
  businessScheme: TextElement; // 商流/座組
  environment: TextElement;   // 環境
  rival: TextElement;         // ライバル
  foreignEnemy: TextElement;  // 外敵
}
```

**各要素の観点：**

| 要素 | キー | 確認すべき観点 |
|------|-----|---------------|
| ひと | `people` | 価値観、実績、メンバー、顧客、強み弱み |
| お金 | `money` | 予算、目標、利益、コスト、資金計画 |
| 時間 | `time` | スケジュール、作業時間、期限、マイルストーン |
| クオリティ | `quality` | 満足感、仕上がり感、技術水準、品質基準 |
| 商流/座組 | `businessScheme` | ビジネスモデル、価値の流れ、契約関係 |
| 環境 | `environment` | 業界、組織、国・地域、社会情勢 |
| ライバル | `rival` | 競合、同じ成果や資源を取り合う存在 |
| 外敵 | `foreignEnemy` | 目的達成を積極的に邪魔するヒトやコト |

```json
{
  "elements": {
    "people": {
      "uuid": "dSBEkjE97WJKusXj4mX3o9",
      "text": "開発チーム5名、マーケ2名、PM1名",
      "comment": { "color": "blue", "text": "" }
    },
    "money": {
      "uuid": "3riARy1KMx37SVDqia834e",
      "text": "開発予算2000万円、広告予算500万円",
      "comment": { "color": "blue", "text": "" }
    },
    "time": {
      "uuid": "gv27PgCn4cfknyJfD9LmuH",
      "text": "2025年1月〜6月（6ヶ月間）",
      "comment": { "color": "blue", "text": "" }
    },
    "quality": {
      "uuid": "3aYHtKs1XCXJbCxRwHTV4M",
      "text": "ページ読み込み2秒以内、稼働率99.5%",
      "comment": { "color": "blue", "text": "" }
    },
    "businessScheme": {
      "uuid": "1dfQPFG8icArT1tPnq3Ybn",
      "text": "自社ECモデル、決済代行サービス利用",
      "comment": { "color": "blue", "text": "" }
    },
    "environment": {
      "uuid": "4X4FuZozxqPMmKLLXLBvzJ",
      "text": "EC市場拡大中、モバイル利用増加傾向",
      "comment": { "color": "blue", "text": "" }
    },
    "rival": {
      "uuid": "vXgTh4JMQQorRiXyFCvN7o",
      "text": "大手ECモール、同業他社EC",
      "comment": { "color": "blue", "text": "" }
    },
    "foreignEnemy": {
      "uuid": "cZH7wrekSzRD2R2vaYazHj",
      "text": "レガシーシステム連携の技術的負債",
      "comment": { "color": "blue", "text": "" }
    }
  }
}
```

## UUID生成

pufu-editorでは短縮UUID形式を使用。以下の方法で生成可能：

```python
import uuid
import base64

def generate_short_uuid():
    """pufu-editor形式の短縮UUIDを生成"""
    u = uuid.uuid4()
    # base64エンコードして短縮
    b64 = base64.urlsafe_b64encode(u.bytes).decode('ascii')
    # パディングを除去して22文字に
    return b64.rstrip('=')

# 例: "2MfGeLrm8PQaaVe3v3ABsV"
```

または、単純なランダム文字列でも可：

```python
import random
import string

def generate_simple_uuid(length=22):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))
```

## 完全なスキーマ例

```json
{
  "winCondition": {
    "uuid": "er2ugQkdnw5WY2ceSGqVNV",
    "text": "月間売上1000万円を達成",
    "comment": { "color": "blue", "text": "" }
  },
  "gainingGoal": {
    "uuid": "2MfGeLrm8PQaaVe3v3ABsV",
    "text": "新規ECサイトのローンチ",
    "comment": { "color": "blue", "text": "" }
  },
  "purposes": [
    {
      "uuid": "9fov1Hdokf2NgsPkWgHatH",
      "text": "使いやすいUI/UXが実現されている",
      "comment": { "color": "blue", "text": "" },
      "measures": [
        {
          "uuid": "cgmABssH3uNG8k5cdato5a",
          "text": "UIプロトタイプを作成する",
          "comment": { "color": "blue", "text": "" },
          "color": "red"
        },
        {
          "uuid": "dNmKUssH2tNG9k5cdato5a",
          "text": "ユーザビリティテストを実施する",
          "comment": { "color": "blue", "text": "" },
          "color": "white"
        }
      ]
    },
    {
      "uuid": "6dVHgBSKhKWrrnA7DP8pYJ",
      "text": "決済システムが安定稼働している",
      "comment": { "color": "blue", "text": "" },
      "measures": [
        {
          "uuid": "cPUE9CEA4XqVKmRCP5LWdB",
          "text": "決済代行サービスを導入する",
          "comment": { "color": "blue", "text": "" },
          "color": "red"
        },
        {
          "uuid": "dPUE9DEA5YrVLmSDP6MXeC",
          "text": "負荷テストを実施する",
          "comment": { "color": "blue", "text": "" },
          "color": "green"
        }
      ]
    },
    {
      "uuid": "7eWIhCSLiLXssoB8EQ9qZK",
      "text": "既存顧客への認知が浸透している",
      "comment": { "color": "blue", "text": "" },
      "measures": [
        {
          "uuid": "ePUF0FFA6ZsWMnTEQ7NYfD",
          "text": "既存顧客向けメール配信を行う",
          "comment": { "color": "blue", "text": "" },
          "color": "white"
        },
        {
          "uuid": "fPUG1GGB7AtXNoUFR8OZgE",
          "text": "初回購入キャンペーンを実施する",
          "comment": { "color": "blue", "text": "" },
          "color": "yellow"
        }
      ]
    }
  ],
  "elements": {
    "people": {
      "uuid": "dSBEkjE97WJKusXj4mX3o9",
      "text": "開発チーム8名、マーケティング2名",
      "comment": { "color": "blue", "text": "" }
    },
    "money": {
      "uuid": "3riARy1KMx37SVDqia834e",
      "text": "開発予算2000万円、広告予算500万円",
      "comment": { "color": "blue", "text": "" }
    },
    "time": {
      "uuid": "gv27PgCn4cfknyJfD9LmuH",
      "text": "2025年1月〜6月（6ヶ月間）",
      "comment": { "color": "blue", "text": "" }
    },
    "quality": {
      "uuid": "3aYHtKs1XCXJbCxRwHTV4M",
      "text": "ページ読み込み2秒以内",
      "comment": { "color": "blue", "text": "" }
    },
    "businessScheme": {
      "uuid": "1dfQPFG8icArT1tPnq3Ybn",
      "text": "自社ECモデル、外部決済代行利用",
      "comment": { "color": "blue", "text": "" }
    },
    "environment": {
      "uuid": "4X4FuZozxqPMmKLLXLBvzJ",
      "text": "EC市場拡大中、モバイル利用増加傾向",
      "comment": { "color": "blue", "text": "" }
    },
    "rival": {
      "uuid": "vXgTh4JMQQorRiXyFCvN7o",
      "text": "大手ECモール（楽天、Amazon）、同業他社EC",
      "comment": { "color": "blue", "text": "" }
    },
    "foreignEnemy": {
      "uuid": "cZH7wrekSzRD2R2vaYazHj",
      "text": "開発リソース不足、レガシー基幹システム連携",
      "comment": { "color": "blue", "text": "" }
    }
  }
}
```
