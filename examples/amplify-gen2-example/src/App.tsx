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
} from "@goto-lab/pufu-editor";
import "./index.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

function App() {
  const [projects, setProjects] = useState<Array<Schema["Project"]["type"]>>(
    []
  );
  const [score, setScore] = useState<Schema["Score"]["type"]>();
  const [projectTitle, setProjectTitle] = useState("-");
  const [loading, setLoading] = useState(false);
  const [commentMode, setCommentMode] = useState(false);

  useEffect(() => {
    listProjects();
  }, []);

  const listProjects = () => {
    client.models.Project.observeQuery().subscribe({
      next: (data) => setProjects([...data.items]),
    });
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
  };

  const saveScore = async () => {
    const currentScore = JSON.parse(getScoreJson("score1") ?? "");
    const newScore = {
      ...score,
      ...currentScore,
    };
    setLoading(true);
    await client.models.Score.update(newScore);
    setTimeout(() => setLoading(false), 300);
  };
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main className="px-16 py-8">
          <h1 className="text-3xl font-bold underline">
            Example: Pufu edtior + Amplify Gen2
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
          <div className="flex justify-between my-4 w-1/2">
            <h1>My projects</h1>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded ml-10"
              onClick={createProjectAndScore}
            >
              + Create project
            </button>
          </div>
          <table className="w-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mb-6">
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
          <div className="max-w-7xl">
            <div className="pl-2 text-gray-600">Project: {projectTitle}</div>
            <div className="flex justify-between">
              <SwitchField
                isChecked={commentMode}
                label="Comment mode"
                labelPosition="start"
                onChange={(e) => {
                  setCommentMode(e.target.checked);
                }}
              />
              {loading ? (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2  mb-2 rounded w-16"
                  disabled={true}
                >
                  <Loader />
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2  mb-2 rounded w-16"
                  onClick={saveScore}
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
        </main>
      )}
    </Authenticator>
  );
}

export default App;
