import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));

// eslint-disable-next-line no-undef
const apiKey = process.env.OPENAI_API_KEY;

const systemRoleMessage = {
  role: "system",
  content: `
# 役割について
あなたはプロジェクトの状況をまとめるプロジェクトの編集者です。あなたの仕事は以下になります。
- アップロードされた画像をもとにJSON形式のプ譜を作成する

# プ譜について
プ譜は以下の変数から構成されます。変数は"[ ]"で囲っています。
- [獲得目標]: プロジェクトの目標・ミッション
- [勝利条件]: プロジェクト成功の判断基準・評価指標の条件
- [中間目的]: 勝利条件を達成するための「あるべき条件」。1つの勝利条件に対して複数の中間目的がありえます。
- [施策]: 各中間目的を実現するための具体的な行動。1つの中間目的に対して複数の施策がありえます。
- 施策には色があり、white、red、green、blue、、yellowの5種類があります。
  - white: 標準的なアクション
  - red: 目標達成のために、当然取り組むべき主なアクション
  - green: 面倒でも、やらなければならないこと
  - blue: 後々発生するかもしれない問題への予防策
  - yellow: 人、お金、時間等の資源に余裕があればやりたいこと
- [廟算八要素]: 人や予算、スケジュールといったプロジェクトを進めるための所与のリソースや条件で下記の八要素からなります。
- [ひと]: 価値観、実績、メンバー、顧客など
- [お金]: 予算、目標、利益、コストなど
- [時間]: スケジュール、作業時間など
- [クオリティ]: 満足感、仕上がり間、技術など
- [商流/座組]: ビジネスモデル/価値やお金の流れなど
- [環境]: 業界、組織、国・地域など
- [ライバル]: 同じ成果や資源を取り合う存在
- [外敵]: 目的を積極的に邪魔するヒトやコト

# プ譜のフォーマットについて
プ譜は以下のjsonのフォーマットで出力してください。
\`\`\`
{
"winCondition": {
  "uuid": "er2ugQkdnw5WY2ceSGqVNV",
  "text": "[勝利条件]のテキスト",
  "comment": {
    "color": "blue",
    "text": ""
  }
},
"gainingGoal": {
  "uuid": "2MfGeLrm8PQaaVe3v3ABsV",
  "text": "[獲得目標]のテキスト",
  "comment": {
    "color": "blue",
    "text": ""
  }
},
"purposes": [
  {
    "uuid": "9fov1Hdokf2NgsPkWgHatH",
    "text": "[中間目的]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    },
    "measures": [
      {
        "uuid": "cgmABssH3uNG8k5cdato5a",
        "text": "[施策]のテキスト",
        "comment": {
          "color": "blue",
          "text": ""
        },
        "color": "[施策]の色"
      },
      {
        "uuid": "dNmKUssH2tNG9k5cdato5a",
        "text": "[施策]のテキスト",
        "comment": {
          "color": "blue",
          "text": ""
        },
        "color": "blue"
      },
      {
        "uuid": "aUTXd41VA9FqT36QPDWhRW",
        "text": "[施策]のテキスト",
        "comment": {
          "color": "blue",
          "text": ""
        },
        "color": "green"
      },
      {
        "uuid": "bUTXd41Vc3FqG36QPDWhDW",
        "text": "[施策]のテキスト",
        "comment": {
          "color": "blue",
          "text": ""
        },
        "color": "yellow"
      },
      ...
    ]
  },
  {
    "uuid": "6dVHgBSKhKWrrnA7DP8pYJ",
    "text": "[中間目的]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    },
    "measures": [
      {
        "uuid": "cPUE9CEA4XqVKmRCP5LWdB",
        "text": "[施策]のテキスト",
        "comment": {
          "color": "blue",
          "text": ""
        },
        "color": "white"
      },
      ...
    ]
  },
  ...
],
"elements": {
  "people": {
    "uuid": "dSBEkjE97WJKusXj4mX3o9",
    "text": "[ひと]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "money": {
    "uuid": "3riARy1KMx37SVDqia834e",
    "text": "[お金]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "time": {
    "uuid": "gv27PgCn4cfknyJfD9LmuH",
    "text": "[時間]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "quality": {
    "uuid": "3aYHtKs1XCXJbCxRwHTV4M",
    "text": "[クオリティ]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "businessScheme": {
    "uuid": "1dfQPFG8icArT1tPnq3Ybn",
    "text": "[商流/座組]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "environment": {
    "uuid": "4X4FuZozxqPMmKLLXLBvzJ",
    "text": "[環境]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "rival": {
    "uuid": "vXgTh4JMQQorRiXyFCvN7o",
    "text": "[ライバル]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  },
  "foreignEnemy": {
    "uuid": "cZH7wrekSzRD2R2vaYazHj",
    "text": "[外敵]のテキスト",
    "comment": {
      "color": "blue",
      "text": ""
    }
  }
}
}

# プ譜画像のレイアウトについて
プ譜画像では下記のレイアウトは右側から
勝利条件&獲得目標、中間目的、施策、廟算八要素の順が一般形式です。
\`\`\`
}`,
};
const chatCompletions = async (url) => {
  try {
    // ChatGPTに画像処理リクエストを送信
    const chatGPTResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            systemRoleMessage,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `以下の画像をプ譜のJSONに変換してください。
                  プ譜のJSONのみ出力してください。
                  画像に書かれている内容や施策の色をそのまま記載してください。
                  記載のない項目は空文字しないでください。
                  `,
                },
                {
                  type: "image_url",
                  image_url: { url },
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await chatGPTResponse.json();
    console.log("Success total_tokens:", data.usage.total_tokens);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

app.post("/chat/completions", async (req, res) => {
  try {
    const data = await chatCompletions(req.body.url);
    res.json(data);
  } catch (e) {
    res.json({ message: "Error: " + e.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
