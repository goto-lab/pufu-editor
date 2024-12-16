import { ChangeEvent, useState } from "react";
import { downloadScore, ProjectScore, setScore } from "@goto-lab/pufu-editor";

function App() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [response, setResponse] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the file."));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files !== null) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("画像ファイルを選択してください。");
      return;
    }
    setAnalyzed(true);
    const base64Image = await convertToBase64(selectedFile);
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
              {
                role: "system",
                content: `
あなたはプロジェクトの編集者です。アップロードされた画像をもとにJSON形式のプ譜を作成してください。
# 役割について
あなたはプロジェクトの状況をまとめるプロジェクトの編集者です。あなたの仕事は以下になります。
- プロジェクトの情報を収集する
- 収集した情報をもとにプ譜を作成する

# プ譜について
プ譜は以下の変数から構成されます。変数は"[ ]"で囲っています。
- [獲得目標]: プロジェクトの目標・ミッション
- [勝利条件]: プロジェクト成功の判断基準・評価指標の条件
- [中間目的]: 勝利条件を達成するための「あるべき条件」。1つの勝利条件に対して複数の中間目的がありえます。
- [施策]: 各中間目的を実現するための具体的な行動。1つの中間目的に対して複数の施策がありえます。
- [廟算八要素]: 人や予算、スケジュールといったプロジェクトを進めるための所与のリソースや条件。下記の八要素からなります。
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
          "uuid": "dNmKUssH2tNG9k5cdato5a",
          "text": "[施策]のテキスト",
          "comment": {
            "color": "blue",
            "text": ""
          },
          "color": "white"
        },
        {
          "uuid": "aUTXd41VA9FqT36QPDWhRW",
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
\`\`\`
}`,
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `以下の画像をJSONに変換してください: `,
                  },
                  {
                    type: "image_url",
                    image_url: { url: base64Image },
                  },
                ],
              },
            ],
          }),
        }
      );

      const chatGPTData = await chatGPTResponse.json();
      setResponse(chatGPTData);
      setScore(
        "score1",
        chatGPTData.choices[0].message.content
          .replace("```json", "")
          .replace("```", "")
      );
      setAnalyzed(false);
    } catch (error) {
      console.error("エラー:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>プ譜画像解析ツール</h1>
      <p style={{ marginTop: "20px" }}>
        プ譜の画像を選択して、送信をクリックしてください。
      </p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        style={{
          margin: "10px",
          padding: "4px 8px",
          color: "#fff",
          backgroundColor: analyzed ? "#bbb" : "#168dff",
          borderRadius: "6px",
          marginLeft: "10px",
        }}
        disabled={analyzed}
        onClick={handleSubmit}
      >
        送信
      </button>
      <p style={{ marginTop: "20px" }}>※解析に1~2分かかります。</p>
      <p>※解析ではOpenAIのAPIリクエスト料金が発生します。</p>
      <p>
        ※リクエストOpenAIのAPIキーが含まれるので、一般には公開しないでください。
      </p>

      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            margin: "10px",
            padding: "4px 8px",
            color: "#fff",
            backgroundColor: "#168dff",
            borderRadius: "6px",
          }}
          onClick={() => {
            downloadScore("score1", "json");
          }}
        >
          Download json
        </button>
        <h2>結果:</h2>
        <ProjectScore uniqueKey="score1" />
        <p>ログ:</p>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default App;
