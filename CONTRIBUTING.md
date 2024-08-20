# Contribution Guide
プ譜エディター開発に関するガイドラインです。

## Issues
次の方法でIssueを受け付けています。

- バグ・不具合についての報告 ⇛ [Bug report](https://github.com/goto-lab/pufu-editor/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=)
- 改善提案・機能要望 ⇛ [Issue: Feature request](https://github.com/goto-lab/pufu-editor/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=)

## Pull request

基本的にはIssueを立ててPRを作成してください。  
誤字脱字などの軽微な修正やExampleの修正の場合は直接PRを作成いただいても大丈夫です。

1. Forkする
2. Branchを作る: git checkout -b <feature/xxxx or fix/xxxx>
3. テストする: npm run storybook 別ターミナルで npm run storybook-test
4. 変更をコミットする: git commit -am 'Add: Create some feature'
5. Pushする: git push origin <feature/xxxx or fix/xxxx>
5. Pull Requestを送る

## Preview

プ譜エディターの変更内容は[Storybook](https://storybook.js.org/)で確認してください。

```
npm run storybook 
```

修正内容に合わせてテストを実装してください。既存のテストコードは`src/tests`に格納されています。

## Directory structure
```
├── .github
│      ├── ISSUE_TEMPLATE # Githubテンプレート
│      └─ workflows # GithubActions設定
├── .storybook　# Storybook設定
├── .vscode　# VSCode設定
├── examples　# 利用例
└── src
     │── components #画面のパーツ
     │── i18n #多言語設定
     │    └── locales #多言語辞書
     │── lib # 共通機能やモデル定義
     │── stories # コンポーネントごとのStorybook実装
     └── tests # テストコード
```
