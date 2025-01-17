# プ譜エディタ Example (vision-analyze-example)

## インストール

```
cd pufu-editor/examples/vision-analyze-example
npm install
```

## OpenAI APIキーの設定

.env-templateを.envにリネームしOpenAIのAPIキーを記載する。

```
OPENAI_API_KEY=<OpenAI APIキー>
```

## OpenAIアクセス用のプロキシサーバー起動

別ターミナルで下記を実行

```
npm run server
```

## 起動

```
npm run dev
```
