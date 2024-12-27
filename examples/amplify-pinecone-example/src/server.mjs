import express from "express";
import cors from "cors";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// eslint-disable-next-line no-undef
const hostUrl = process.env.PINECONE_URL;
const pc = new Pinecone({
  apiKey: "pclocal",
  controllerHostUrl: hostUrl,
});
const indexName = "score-index";

const openai = new OpenAI();

const getIndex = async () => {
  const descIndex = await pc.describeIndex(indexName);
  return pc.index(indexName, "http://" + descIndex.host);
};

const getEmbedding = async (input) => {
  console.log("Request getEmbedding");
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
    encoding_format: "float",
  });
  return embedding.data[0].embedding;
};

const upsert = async (id, projectId, projectTitle, scoreId, kind, text) => {
  const vector = await getEmbedding(text);
  const index = await getIndex();
  await index.namespace("ns1").upsert([
    {
      id: scoreId + "-" + id,
      values: vector,
      metadata: { projectId, projectTitle, scoreId, kind, text },
    },
  ]);
};

app.get("/create-index", async (req, res) => {
  try {
    await pc.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    res.json({ message: "Create index: " + indexName });
  } catch (e) {
    res.json({ message: "Create index error: " + e.message });
  }
});

app.get("/delete-index", async (req, res) => {
  try {
    await pc.deleteIndex(indexName);
    res.json({ message: "Delete index: " + indexName });
  } catch (e) {
    res.json({ message: "Delete index error: " + e.message });
  }
});

app.get("/records", async (req, res) => {
  try {
    const index = await getIndex();
    const list = await index.namespace("ns1").listPaginated();
    res.json(list);
  } catch (e) {
    res.json({ message: "Records error: " + e.message });
  }
});

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to the root endpoint!" });
});

app.post("/upsert", async (req, res) => {
  const { id, projectId, projectTitle, scoreId, kind, text } = req.body;
  await upsert(id, projectId, projectTitle, scoreId, kind, text);
  res.json({ message: "Insert id:" + id });
});

app.post("/upsert-bulk", async (req, res) => {
  const { score, projectTitle } = req.body;
  const scoreId = score.id;
  const projectId = score.projectId;
  if (score.winCondition.text) {
    await upsert(
      score.winCondition.uuid,
      projectId,
      projectTitle,
      scoreId,
      "winCondition",
      score.winCondition.text
    );
  }
  if (score.gainingGoal.text) {
    await upsert(
      score.gainingGoal.uuid,
      projectId,
      projectTitle,
      scoreId,
      "gainingGoal",
      score.gainingGoal.text
    );
  }
  for (const purpose of score.purposes) {
    if (purpose.text) {
      await upsert(
        purpose.uuid,
        projectId,
        projectTitle,
        scoreId,
        "purpose",
        purpose.text
      );
    }
    for (const measure of purpose.measures) {
      if (measure.text) {
        await upsert(
          measure.uuid,
          projectId,
          projectTitle,
          scoreId,
          "measure",
          measure.text
        );
      }
    }
  }
  for (const key of [
    "people",
    "money",
    "time",
    "quality",
    "businessScheme",
    "environment",
    "rival",
    "foreignEnemy",
  ]) {
    if (score.elements[key].text) {
      await upsert(
        score.elements[key].uuid,
        projectId,
        projectTitle,
        scoreId,
        "elements-" + key,
        score.elements[key].text
      );
    }
  }
  res.json({ message: "Insert project id:" + projectId });
});

app.get("/search", async (req, res) => {
  const getVectorByQuery = async (query) => {
    if (query.text) {
      return await getEmbedding(req.query.text);
    } else {
      const index = await getIndex();
      const result = await index.namespace("ns1").fetch([req.query.id]);
      return result.records[req.query.id].values;
    }
  };
  try {
    const vector = await getVectorByQuery(req.query);
    const index = await getIndex();
    const queryResponse = await index.namespace("ns1").query({
      vector,
      topK: 5,
      includeValues: false,
      includeMetadata: true,
    });
    res.json(queryResponse.matches);
  } catch (e) {
    res.json({ message: "Search error: " + e.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
