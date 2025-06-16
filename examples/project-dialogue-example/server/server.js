import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// 環境変数の読み込み - .envファイルを読み込み
dotenv.config({ path: "./.env" });

// デバッグ用ログ
console.log("=== Environment Variables Debug ===");
console.log("LLM_PROVIDER from env:", process.env.LLM_PROVIDER);
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("PORT from env:", process.env.PORT);
console.log("====================================");

const app = express();
const port = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// LLMプロバイダーの選択
const LLM_PROVIDER = process.env.LLM_PROVIDER || "openai"; // 'openai' or 'gemini'
console.log("Selected LLM_PROVIDER:", LLM_PROVIDER);

// APIキーの取得
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// VOICEVOX設定
const VOICEVOX_URL = "http://localhost:50021";

// プロバイダー情報エンドポイント
app.get("/api/provider", (req, res) => {
  res.json({ provider: LLM_PROVIDER });
});

// 質問生成エンドポイント
app.post("/api/generate-question", async (req, res) => {
  console.log("[API] /api/generate-question called");
  console.log("[API] Using LLM provider:", LLM_PROVIDER);
  try {
    const { userResponses } = req.body;
    console.log(
      "[API] User responses received:",
      userResponses?.length || 0,
      "items"
    );

    if (LLM_PROVIDER === "openai") {
      console.log("[API] Calling OpenAI question generation...");
      const response = await generateQuestionOpenAI(userResponses);
      console.log("[API] OpenAI response received");
      res.json({ question: response });
    } else if (LLM_PROVIDER === "gemini") {
      console.log("[API] Calling Gemini question generation...");
      const response = await generateQuestionGemini(userResponses);
      console.log("[API] Gemini response received");
      res.json({ question: response });
    } else {
      throw new Error("Invalid LLM provider");
    }
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: error.message });
  }
});

// プロジェクト情報生成エンドポイント
app.post("/api/generate-project-info", async (req, res) => {
  console.log("[API] /api/generate-project-info called");
  console.log("[API] Using LLM provider:", LLM_PROVIDER);
  try {
    const { userResponses } = req.body;
    console.log("[API] User responses received for project info generation");

    if (LLM_PROVIDER === "openai") {
      console.log("[API] Calling OpenAI project info generation...");
      const response = await generateProjectInfoOpenAI(userResponses);
      console.log("[API] OpenAI project info response received");
      res.json(response);
    } else if (LLM_PROVIDER === "gemini") {
      console.log("[API] Calling Gemini project info generation...");
      const response = await generateProjectInfoGemini(userResponses);
      console.log("[API] Gemini project info response received");
      res.json(response);
    } else {
      throw new Error("Invalid LLM provider");
    }
  } catch (error) {
    console.error("Error generating project info:", error);
    res.status(500).json({ error: error.message });
  }
});

// フィードバック生成エンドポイント
app.post("/api/generate-feedback", async (req, res) => {
  console.log("[API] /api/generate-feedback called");
  console.log("[API] Using LLM provider:", LLM_PROVIDER);
  try {
    const { userResponse, stepId } = req.body;
    console.log(
      "[API] User response received for feedback generation, stepId:",
      stepId
    );

    if (LLM_PROVIDER === "openai") {
      console.log("[API] Calling OpenAI feedback generation...");
      const response = await generateFeedbackOpenAI(userResponse, stepId);
      console.log("[API] OpenAI feedback response received");
      res.json({ feedback: response });
    } else if (LLM_PROVIDER === "gemini") {
      console.log("[API] Calling Gemini feedback generation...");
      const response = await generateFeedbackGemini(userResponse, stepId);
      console.log("[API] Gemini feedback response received");
      res.json({ feedback: response });
    } else {
      throw new Error("Invalid LLM provider");
    }
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: error.message });
  }
});

// OpenAI関連の関数
async function generateQuestionOpenAI(userResponses) {
  const context = userResponses.join("\n\n");

  const systemPrompt = `
# 役割について
あなたはプロジェクトの振り返りをサポートするAIアシスタントです。
ユーザーのこれまでの回答を踏まえて、プロジェクトをより深く理解ための質問を生成してください。

# 質問の方針
- 1回の質問で複数の項目を聞く
- 具体的で答えやすい質問にする
- これまでの回答と矛盾しない内容にする
`;

  const userPrompt = `
これまでのユーザーの回答：
${context}

上記の回答を踏まえて、プロジェクトをより深く理解するための質問を1つ生成してください。
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateProjectInfoOpenAI(userResponses) {
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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // JSONの抽出（コードブロックから）
  const jsonMatch =
    content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  } else {
    return JSON.parse(content);
  }
}

// フィードバック生成関数（OpenAI）
async function generateFeedbackOpenAI(userResponse, stepId) {
  const questionTopics = {
    3: "プロジェクトの出発点",
    5: "仮説と取り組みの方向性",
    7: "実際の取り組み",
    9: "観察（起きたこと・気づいたこと）",
    11: "意味づけ（学び・変化・価値）",
  };

  const topic = questionTopics[stepId] || "回答";

  const systemPrompt = `
# 役割について
あなたはプロジェクトの振り返りをサポートするAIアシスタントです。
ユーザーの回答に対して、励ましや共感を示しながら、簡潔なフィードバックを提供してください。

# フィードバックの方針
- ユーザーの経験を肯定的に受け止める
- 回答内容の中で特に印象的な点を一つピックアップする
- フィードバックのみで追加の質問はしない
  - ただし、質問は続くので総括する内容は避ける
- 2-3文程度の簡潔なフィードバックにする
`;

  const userPrompt = `
ユーザーが「${topic}」について以下のように回答しました：

${userResponse}

この回答に対して、励ましや共感を示しながら、簡潔なフィードバックを提供してください。
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 200,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Gemini関連の関数
async function generateQuestionGemini(userResponses) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const context = userResponses.join("\n\n");

  const prompt = `
あなたはプロジェクトの振り返りをサポートするAIアシスタントです。

これまでのユーザーの回答：
${context}

上記の回答を踏まえて、プロジェクトの詳細情報を収集するための質問を1つ生成してください。
プロジェクト名、期間、具体的な目標、実施した施策などを聞いてください。

# 質問の方針
- 1回の質問で複数の項目を聞く
- 具体的で答えやすい質問にする
- これまでの回答と矛盾しない内容にする
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateProjectInfoGemini(userResponses) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const responses = Object.values(userResponses);
  const context = responses.join("\n\n");

  const prompt = `
プロジェクトの振り返り内容からプ譜（Project Score）を生成してください。

プロジェクト振り返り内容：
${context}

以下のJSON形式で出力してください：
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

JSONのみを出力してください。説明文は不要です。
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();

  // JSONの抽出（コードブロックから）
  const jsonMatch =
    content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1] || jsonMatch[0]);
  } else {
    return JSON.parse(content);
  }
}

// フィードバック生成関数（Gemini）
async function generateFeedbackGemini(userResponse, stepId) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const questionTopics = {
    3: "プロジェクトの出発点",
    5: "仮説と取り組みの方向性",
    7: "実際の取り組み",
    9: "観察（起きたこと・気づいたこと）",
    11: "意味づけ（学び・変化・価値）",
  };

  const topic = questionTopics[stepId] || "回答";

  const prompt = `
あなたはプロジェクトの振り返りをサポートするAIアシスタントです。

ユーザーが「${topic}」について以下のように回答しました：
${userResponse}

この回答に対して、励ましや共感を示しながら、簡潔なフィードバックを提供してください。

# フィードバックの方針
- ユーザーの経験を肯定的に受け止める
- 回答内容の中で特に印象的な点を一つピックアップする
- フィードバックのみで追加の質問はしない
  - ただし、質問は続くので総括する内容は避ける
- 2-3文程度の簡潔なフィードバックにする
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// VOICEVOX関連エンドポイント

// 音声合成エンドポイント
app.post("/api/synthesize", async (req, res) => {
  try {
    const {
      text,
      speaker = 3, // デフォルトはずんだもん
      speedScale = 1.2,
      pitchScale = 0,
      intonationScale = 1,
      volumeScale = 1,
      prePhonemeLength = 0.1,
      postPhonemeLength = 0.1,
    } = req.body;

    // 音声クエリの作成
    const queryResponse = await axios.post(
      `${VOICEVOX_URL}/audio_query`,
      null,
      {
        params: { text, speaker },
      }
    );

    const audioQuery = queryResponse.data;

    // パラメータの調整
    audioQuery.speedScale = speedScale;
    audioQuery.pitchScale = pitchScale;
    audioQuery.intonationScale = intonationScale;
    audioQuery.volumeScale = volumeScale;
    audioQuery.prePhonemeLength = prePhonemeLength;
    audioQuery.postPhonemeLength = postPhonemeLength;

    // 音声合成
    const synthesisResponse = await axios.post(
      `${VOICEVOX_URL}/synthesis`,
      audioQuery,
      {
        params: { speaker },
        responseType: "arraybuffer",
      }
    );

    // 音声データをBase64で返す
    const audioBase64 = Buffer.from(synthesisResponse.data).toString("base64");
    res.json({ audio: audioBase64 });
  } catch (error) {
    console.error("音声合成エラー:", error.message);
    res.status(500).json({ error: "音声合成に失敗しました" });
  }
});

// スピーカー一覧取得
app.get("/api/speakers", async (req, res) => {
  try {
    const response = await axios.get(`${VOICEVOX_URL}/speakers`);
    res.json(response.data);
  } catch (error) {
    console.error("スピーカー取得エラー:", error.message);
    res.status(500).json({ error: "スピーカー情報の取得に失敗しました" });
  }
});

// ヘルスチェック
app.get("/api/health", async (req, res) => {
  try {
    await axios.get(`${VOICEVOX_URL}/version`);
    res.json({ status: "ok", voicevox: "connected" });
  } catch (error) {
    res.status(503).json({ status: "error", voicevox: "disconnected" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Using LLM provider: ${LLM_PROVIDER}`);
  console.log(
    "VOICEVOXが http://localhost:50021 で起動していることを確認してください"
  );
});
