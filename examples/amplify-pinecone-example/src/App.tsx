import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import { Authenticator, Loader, SwitchField } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import short from "short-uuid";
import {
  ProjectScore,
  getScoreJson,
  ProjectScoreModel,
  setScore as setScoreByKey,
  EightElementsModel,
} from "@goto-lab/pufu-editor";
import "./index.css";
import { ImportButton, ModalDialog } from "./common";

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface SearchResult {
  id: string;
  score: number;
  metadata: {
    projectId: string;
    projectTitle: string;
    kind: string;
    scoreId: string;
    text: string;
  };
}
interface SearchResultByItem {
  text: string;
  kind: string;
  records: SearchResult[];
}

function App() {
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>(
    []
  );
  const [score, setScore] = useState<Schema["Score"]["type"]>();
  const [projectTitle, setProjectTitle] = useState("-");
  const [loading, setLoading] = useState(false);
  const [commentMode, setCommentMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchResultByItems, setSearchResultByItems] = useState<
    SearchResultByItem[]
  >([]);
  const pineconeProxyUrl = import.meta.env.VITE_PINECONE_PROXY_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [scoreText, setScoreText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    listProjects();
    initePinecone();
  }, []);

  const listProjects = () => {
    client.models.Project.observeQuery().subscribe({
      next: (data) => setProjects([...data.items]),
    });
  };

  const initePinecone = () => {
    fetch(pineconeProxyUrl + "/create-index");
  };

  const createProject = async () => {
    return await client.models.Project.create({
      title: window.prompt("Score title") ?? "no name",
    });
  };

  const deleteProject = async (id: string) => {
    await client.models.Project.delete({ id });
  };

  const createScore = (projectId: string) => {
    const createComment = () => {
      return {
        color: "green",
        text: "",
      } as {
        color: "blue" | "green" | "red";
        text: string;
      };
    };
    return client.models.Score.create({
      projectId,
      number: 1,
      winCondition: {
        uuid: short.generate(),
        text: "",
        comment: createComment(),
      },
      gainingGoal: {
        uuid: short.generate(),
        text: "",
        comment: createComment(),
      },
      purposes: [
        {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
          measures: [
            {
              uuid: short.generate(),
              text: "",
              color: "white",
              comment: createComment(),
            } as {
              uuid: string;
              text: string;
              color: "white" | "blue" | "green" | "red";
              comment: {
                color: "blue" | "green" | "red";
                text: string;
              };
            },
          ],
        },
      ],
      elements: {
        people: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        money: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        time: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        quality: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        businessScheme: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        environment: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        rival: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
        foreignEnemy: {
          uuid: short.generate(),
          text: "",
          comment: createComment(),
        },
      },
    });
  };
  const getScore = async (projectId: string) => {
    return (
      await client.models.Score.listByProjectId({
        projectId,
      })
    ).data[0];
  };
  const deleteScore = async (id: string) => {
    await client.models.Score.delete({ id });
  };

  const createProjectAndScore = async () => {
    const { data } = await createProject();
    if (data?.id) {
      createScore(data.id);
    }
  };

  const deleteProjectAndScore = async (projectId: string) => {
    deleteProject(projectId);
    const score = await getScore(projectId);
    deleteScore(score.id);
  };

  const loadScore = async (projectId: string, projectTitle: string) => {
    setCommentMode(false);
    setProjectTitle(projectTitle);
    const score = await getScore(projectId);
    setScore(score);
    searchByScore(score);
  };

  const saveScore = async () => {
    const currentScore = JSON.parse(getScoreJson("score1") ?? "");
    const newScore = {
      ...score,
      ...currentScore,
    };
    setLoading(true);
    await client.models.Score.update(newScore);
    fetch(pineconeProxyUrl + "/upsert-bulk", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score: newScore,
        projectTitle,
      }),
    });
    setTimeout(() => setLoading(false), 300);
  };

  const search = async () => {
    const res = await fetch(pineconeProxyUrl + "/search?text=" + searchText);
    const data = await res.json();
    if (Array.isArray(data)) {
      setSearchResults(data as unknown as SearchResult[]);
    } else {
      alert("Search failed.");
    }
  };

  const searchByScore = async (score: Schema["Score"]["type"]) => {
    const localSearch = async (id: string) => {
      const res = await fetch(pineconeProxyUrl + "/search?id=" + id);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data as unknown as SearchResult[];
      } else {
        return [];
      }
    };
    const results = [];
    if (score.winCondition.text) {
      results.push({
        text: score.winCondition.text,
        kind: "winCondition",
        records: (await localSearch(score.id + "-" + score.winCondition.uuid))
          .filter(
            (r) =>
              r.id !== score.id + "-" + score.winCondition.uuid &&
              r.score > 0.35
          )
          .slice(0, 5),
      });
    }
    if (score.gainingGoal.text) {
      results.push({
        text: score.gainingGoal.text,
        kind: "gainingGoal",
        records: (await localSearch(score.id + "-" + score.gainingGoal.uuid))
          .filter(
            (r) =>
              r.id !== score.id + "-" + score.gainingGoal.uuid && r.score > 0.35
          )
          .slice(0, 5),
      });
    }
    for (const purpose of score.purposes ?? []) {
      if (purpose?.text) {
        results.push({
          text: purpose?.text,
          kind: "purpose",
          records: (await localSearch(score.id + "-" + purpose.uuid))
            .filter(
              (r) => r.id !== score.id + "-" + purpose.uuid && r.score > 0.35
            )
            .slice(0, 5),
        });
      }
      for (const measure of purpose?.measures ?? []) {
        if (measure?.text) {
          results.push({
            text: measure?.text,
            kind: "measure",
            records: (await localSearch(score.id + "-" + measure.uuid))
              .filter(
                (r) => r.id !== score.id + "-" + measure.uuid && r.score > 0.35
              )
              .slice(0, 5),
          });
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
      if (score.elements[key as keyof EightElementsModel]) {
        const element = score.elements[key as keyof EightElementsModel];
        if (element?.text) {
          results.push({
            text: element?.text,
            kind: "elements-" + key,
            records: (await localSearch(score.id + "-" + element.uuid)).filter(
              (r) => r.id !== score.id + "-" + element.uuid && r.score > 4
            ),
          });
        }
      }
    }
    console.log(results);
    setSearchResultByItems(results as unknown as SearchResultByItem[]);
  };

  const kindMap = (kind: string) => {
    switch (kind) {
      case "winCondition":
        return "勝利条件";
      case "gainingGoal":
      case "purpose":
        return "中間目的";
      case "measure":
        return "施策";
      case "elements-people":
        return "廟算八要素(人)";
      case "elements-money":
        return "廟算八要素(お金)";
      case "elements-time":
        return "廟算八要素(時間)";
      case "elements-quality":
        return "廟算八要素(クオリティ)";
      case "elements-businessScheme":
        return "廟算八要素(商流/座組)";
      case "elements-environment":
        return "廟算八要素(環境)";
      case "elements-rival":
        return "廟算八要素(ライバル)";
      case "elements-foreignEnemy":
        return "廟算八要素(外敵)";
    }
  };
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main className="px-16 py-8">
          <h1 className="text-3xl font-bold underline">
            Example: Pufu editor Search(Amplify Gen2 + Pinecone)
          </h1>
          <div className="py-2">
            {user?.signInDetails?.loginId}'s scores{" "}
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white px-2 py-1 rounded ml-2"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
          <div className="flex justify-between my-4">
            <div className="w-2/5">
              <div className="flex justify-start my-4">
                <h2>Projects</h2>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white px-2 rounded ml-2 font-bold"
                  onClick={createProjectAndScore}
                >
                  +
                </button>
              </div>
              <table className="my-4 w-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-6">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td
                        className="px-6 py-3 text-blue-600 hover:cursor-pointer"
                        onClick={() => loadScore(project.id, project.title)}
                      >
                        {project.title}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(project.createdAt).toLocaleString()}
                      </td>
                      <td
                        className="px-6 py-3 text-red-600 hover:cursor-pointer"
                        onClick={() => deleteProjectAndScore(project.id)}
                      >
                        delete
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-3/5">
              <div className="mb-3 xl:w-96">
                <div className="relative flex w-full flex-wrap items-stretch">
                  <input
                    type="search"
                    className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-500 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="button-addon2"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                  <span
                    className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-500"
                    id="basic-addon2"
                    onClick={search}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <table className="my-4 w-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-6">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Project Title</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Kind</th>
                    <th className="px-6 py-3">Text</th>
                  </tr>
                </thead>
                <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {searchResults.map((result) => (
                    <tr key={result.id}>
                      <td
                        className="px-6 py-3 text-blue-600 hover:cursor-pointer"
                        onClick={() =>
                          loadScore(
                            result.metadata.projectId,
                            result.metadata.projectTitle
                          )
                        }
                      >
                        {result.metadata.projectTitle}
                      </td>
                      <td className="px-6 py-3">{result.score.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        {kindMap(result.metadata.kind)}
                      </td>
                      <td className="px-6 py-3">{result.metadata.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="max-w-7xl">
            <div className="pl-2 text-gray-600">Project: {projectTitle}</div>
            <div className="flex justify-end">
              <SwitchField
                isChecked={commentMode}
                label="Comment mode"
                labelPosition="start"
                onChange={(e) => {
                  setCommentMode(e.target.checked);
                }}
              />

              <ImportButton
                onClick={() => {
                  const json = getScoreJson("score1");
                  setScoreText(json!);
                  setIsOpen(true);
                  setError("");
                }}
              />
              <ModalDialog
                open={isOpen}
                text={scoreText}
                error={error}
                onCancel={() => setIsOpen(false)}
                onChange={(text: string) => {
                  setScoreText(text);
                }}
                onOk={() => {
                  try {
                    setError("");
                    setScoreByKey("score1", scoreText);
                    setIsOpen(false);
                  } catch (e) {
                    console.error(e);
                    if (e instanceof Error) {
                      setError(e.message);
                    }
                  }
                }}
              />
              {loading ? (
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white py-1 px-2  my-2 rounded w-8"
                  disabled={true}
                >
                  <Loader />
                </button>
              ) : (
                <button
                  className={`${projectTitle !== "-" ? "bg-orange-500 hover:bg-orange-700" : "bg-gray-500"} text-white py-1 px-2 my-2 rounded w-16 h-8`}
                  onClick={saveScore}
                  disabled={projectTitle === "-"}
                >
                  Save
                </button>
              )}
            </div>
            <ProjectScore
              uniqueKey="score1"
              initScore={score as ProjectScoreModel}
              feedback={commentMode}
            />
          </div>
          <div className="my-4">
            <h2>関連項目</h2>
            {searchResultByItems
              .filter((resultItem) => resultItem.records.length > 0)
              .map((resultItem) => {
                return (
                  <div>
                    <div className="text-gray-600">
                      &lt;{kindMap(resultItem.kind)}&gt; {resultItem.text}
                    </div>
                    <table className="my-4 w-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-6">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th className="px-6 py-3">Project Title</th>
                          <th className="px-6 py-3">Score</th>
                          <th className="px-6 py-3">Kind</th>
                          <th className="px-6 py-3">Text</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        {resultItem.records.map((result) => (
                          <tr key={result.id}>
                            <td
                              className="px-6 py-3 text-blue-600 hover:cursor-pointer"
                              onClick={() =>
                                loadScore(
                                  result.metadata.projectId,
                                  result.metadata.projectTitle
                                )
                              }
                            >
                              {result.metadata.projectTitle}
                            </td>
                            <td className="px-6 py-3">
                              {result.score.toFixed(2)}
                            </td>
                            <td className="px-6 py-3">
                              {kindMap(result.metadata.kind)}
                            </td>
                            <td className="px-6 py-3">
                              {result.metadata.text}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
