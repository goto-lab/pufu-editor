# プ譜エディタ Example (First intall)

## インストール

```
npm create vite@latest first-intall -- --template react-ts
npm install
npm install @goto-lab/pufu-editor
```

## OpenAI APIキーの設定

.env-templateを.envにリネームしOpenAIのAPIキーを記載する。

```
VITE_OPENAI_API_KEY=<OpenAI APIキー>
```

## 起動

```
npm run dev
```
