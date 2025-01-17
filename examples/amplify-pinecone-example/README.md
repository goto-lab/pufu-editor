# プ譜エディタ検索 Example (Amplify + Pinecone)

注意事項

- OpenAIのAPIを利用するためAPI利用料が発生します。
- Pinecone Localにロードされたレコードは、Pinecone Localが停止するとレコードは削除されます。

## パッケージインストール

```
cd <project path>/examples/amplify-pinecone-example
npm install
```

## .envファイルの作成

.envを.env-templateからコピー

```
cp .env-template .env
```

.envをエディタで開き、OpenAIのAPIキーを記載

```
vim .env

VITE_PINECONE_HOST=http://localhost:5080
VITE_PINECONE_PROXY_URL=http://localhost:3000
VITE_OPENAI_API_KEY=
```

## Amplify sandboxの立ち上げ

```
npx ampx sandbox
OR
# プロファイルや識別子を指定する場合
npx ampx sandbox --profile <profile> --identifier identifier>
```

https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/

## Pinecone localの設定

[【公式】Local development with Pinecone Local](https://docs.pinecone.io/guides/operations/local-development)

[Pinecone のベクトルデータベースをエミュレートできる Pinecone Local を試してみた](https://dev.classmethod.jp/articles/trying-pinecone-local-vector-database-emulator/)

Dockerイメージのダウンロード

```
docker pull ghcr.io/pinecone-io/pinecone-index:latest
```

Pinecone Localの起動

```
docker run -d \
--name index1 \
-e PORT=5080 \
-e INDEX_TYPE=serverless \
-e DIMENSION=2 \
-e METRIC=cosine \
-p 5081:5081 \
--platform linux/amd64 \
ghcr.io/pinecone-io/pinecone-index:latest
```

## Pinecone Localアクセス用のプロキシサーバー起動

別ターミナルで下記を実行

```
npm run server
```

## 起動

```
npm run dev
```
