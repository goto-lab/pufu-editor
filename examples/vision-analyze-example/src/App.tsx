import { ChangeEvent, useState } from "react";
import { downloadScore, ProjectScore, setScore } from "@goto-lab/pufu-editor";

function App() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [base64ImageUrl, setBase64ImageUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (result) {
          resolve(result as string);
        } else {
          reject(result);
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read the file."));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files !== null) {
      setSelectedFile(event.target.files[0]);
      const base64Image = await convertToBase64(event.target.files[0]);
      setBase64ImageUrl(base64Image);
    }
  };
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("画像ファイルを選択してください。");
      return;
    }
    setAnalyzed(true);
    try {
      // ChatGPTに画像処理リクエストを送信
      const chatGPTResponse = await fetch(
        "http://localhost:3000/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: base64ImageUrl }),
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
      setAnalyzed(false);
      console.error("エラー:", error);
      alert("エラー:" + (error as Error).message);
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
      <img src={base64ImageUrl} style={{ width: "200px" }} />
      <p style={{ marginTop: "20px" }}>※解析に1~2分かかります。</p>
      <p>※解析ではOpenAIのAPIリクエスト料金が発生します。</p>

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
