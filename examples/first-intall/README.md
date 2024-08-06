# プ譜エディタ Example (First intall)

## インストール

```
npm create vite@latest first-intall -- --template react-ts
npm install
npm install @goto-lab/pufu-editor
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
