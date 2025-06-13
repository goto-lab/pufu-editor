export class OpenAIService {
  private static instance: OpenAIService;
  private apiKey: string | null = null;

  private constructor() {
    // 環境変数からAPIキーを取得（開発時は直接設定も可能）
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
  }

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateQuestion(userResponses: string[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OpenAI APIキーが設定されていません");
    }

    const context = userResponses.join("\n\n");

    const systemPrompt = `
# 役割について
あなたはプロジェクトの振り返りをサポートするAIアシスタントです。
ユーザーのこれまでの回答を踏まえて、プロジェクトの詳細を把握するための質問を生成してください。

# 目的
- プロジェクトの基本情報（名前、期間、目標など）を明確にする
- 具体的な施策や行動を特定する
- 成果や学びを整理する

# 質問の方針
- 1回の質問で複数の項目を聞く
- 具体的で答えやすい質問にする
- これまでの回答と矛盾しない内容にする
`;

    const userPrompt = `
これまでのユーザーの回答：
${context}

上記の回答を踏まえて、プロジェクトの詳細情報を収集するための質問を1つ生成してください。
プロジェクト名、期間、具体的な目標、実施した施策などを聞いてください。
`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API呼び出しエラー:", error);
      throw error;
    }
  }

  async generateProjectInfo(userResponses: {
    [stepId: number]: string;
  }): Promise<any> {
    if (!this.apiKey) {
      throw new Error("OpenAI APIキーが設定されていません");
    }

    const responses = Object.values(userResponses);
    const context = responses.join("\n\n");

    const systemPrompt = `
# 役割について
あなたはプロジェクトの振り返り内容からプ譜（Project Score）を生成するAIアシスタントです。

# プ譜の構造
プ譜は以下の要素で構成されます：
- 獲得目標（GainingGoal）: プロジェクトの目的・ミッション
- 勝利条件（WinCondition）: 成功の基準
- 中間目的（IntermediatePurpose）: 勝利条件達成のための中間目標
- 施策（Measures）: 各中間目的のための具体的行動
- 8要素: ひと、お金、時間、クオリティ、商流/座組、環境、ライバル、外敵

# 出力形式
JSON形式で以下の構造で出力してください：
{
  "winCondition": {
    "uuid": "ランダムなUUID",
    "text": "勝利条件のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "gainingGoal": {
    "uuid": "ランダムなUUID",
    "text": "獲得目標のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "purposes": [
    {
      "uuid": "ランダムなUUID",
      "text": "中間目的のテキスト",
      "comment": {
        "color": "blue",
        "text": ""
      },
      "measures": [
        {
          "uuid": "ランダムなUUID",
          "text": "施策のテキスト",
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
      "uuid": "ランダムなUUID",
      "text": "ひとに関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "money": {
      "uuid": "ランダムなUUID",
      "text": "お金に関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "time": {
      "uuid": "ランダムなUUID",
      "text": "時間に関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "quality": {
      "uuid": "ランダムなUUID",
      "text": "クオリティに関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "businessScheme": {
      "uuid": "ランダムなUUID",
      "text": "商流/座組に関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "environment": {
      "uuid": "ランダムなUUID",
      "text": "環境に関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "rival": {
      "uuid": "ランダムなUUID",
      "text": "ライバルに関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    },
    "foreignEnemy": {
      "uuid": "ランダムなUUID",
      "text": "外敵に関する状況",
      "comment": {
        "color": "blue",
        "text": ""
      }
    }
  }
}
`;

    const userPrompt = `
以下のプロジェクト振り返り内容から、プ譜を生成してください：

${context}

上記の内容を分析して、プ譜のJSON形式で出力してください。
`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
            max_tokens: 1500,
            temperature: 0.3,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // JSONの抽出（コードブロックから）
      const jsonMatch =
        content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        return JSON.parse(content);
      }
    } catch (error) {
      console.error("プ譜生成エラー:", error);
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
