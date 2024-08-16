# プ譜エディタ Example (Amplify Gen2)

## インストール

```
npm create vite@latest first-intall -- --template react-ts
npm install
npm create amplify@latest
npm install @aws-amplify/ui-react
npm install @goto-lab/pufu-editor
```

## TailWindの設定

[Install Tailwind CSS with Vite](https://tailwindcss.com/docs/guides/vite) に沿って
インストールとtailwind.config.jsやindex.cssの設定を行う

## Amplify sandboxの立ち上げ

```

npx ampx sandbox
OR
npx ampx sandbox --profile <profile> --identifier identifier>

```

tsconfig.app.json

```

- "include": ["src"]

* "include": ["src", "amplity"]

```

## App.tsxを修正

```

import { ProjectScore } from "@goto-lab/pufu-editor";

function App() {
return (
<>
<ProjectScore />
</>
);
}

export default App;

```

## 起動

```

npm run dev

```

```

```
