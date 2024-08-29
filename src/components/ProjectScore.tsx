import { useState, useEffect, useMemo, useRef } from "react";
import { ReactSortable } from "react-sortablejs";
import domtoimage from "dom-to-image";
import modelsTI from "../lib/models-ti";
import { i18n } from "i18next";
import "../i18n/config";
import { createCheckers } from "ts-interface-checker";
import { ProjectScoreModel, SupportLanguage, TextSize } from "../lib/models";
import { createScoreKey, ProjectScoreStore } from "../lib/store";
import { useProjectScoreStoreEffect, useI18Translation } from "../lib/hooks";
import { EightElements } from "./EightElements";
import { Measure, AddMeasure, AddMeasureIcon } from "./Measure";
import { IntermediatePurpose, AddPurpose } from "./IntermediatePurpose";
import { ObjectiveBox } from "./ObjectiveBox";
import { Edges } from "./Edges";
import { logger } from "../lib/logger";

export interface ProjectScoreProps {
  initScore?: ProjectScoreModel;
  uniqueKey?: string;
  feedback?: boolean;
  preview?: boolean;
  dark?: boolean;
  mobile?: boolean;
  lang?: SupportLanguage;
  textSize?: TextSize;
  width?: number;
  border?: boolean;
}

let state: ProjectScoreStore;

export const ProjectScore = ({
  initScore,
  uniqueKey,
  feedback = false,
  preview = false,
  dark = false,
  mobile = false,
  lang = "ja",
  textSize = "small",
  width,
  border = true,
}: ProjectScoreProps) => {
  const [scoreKey] = useState(uniqueKey ?? createScoreKey());
  const scoreRef = useRef<HTMLDivElement | null>(null);

  const [action, setAction] = useState(false);
  const updateAction = () => {
    setAction(!action);
  };

  state = useProjectScoreStoreEffect(scoreKey, updateAction, initScore);

  const { i18n } = useI18Translation(lang);

  const hideMeasure = (
    purposeIndex: number,
    measureIndex: number,
    text: string
  ): boolean => {
    if (preview && text) {
      return state.scores[scoreKey].purposes
        .map((p, pIndex) => {
          return p.measures
            .map((m, mIndex) => {
              if (m.text === text) {
                if (pIndex === purposeIndex && mIndex == measureIndex)
                  return false;
                if (pIndex < purposeIndex) return true;
                if (pIndex === purposeIndex && mIndex < measureIndex)
                  return true;
              }
              return false;
            })
            .reduce((a, b) => a || b);
        })
        .reduce((a, b) => a || b);
    }
    return false;
  };

  const scoreStyle = useMemo(() => {
    return width
      ? {
          width: `${width}px`,
        }
      : {};
  }, [width]);

  return (
    <>
      {scoreKey in state.scores ? (
        <div
          id={`score-${scoreKey}`}
          className={`relative ${mobile ? "px-4" : "flex justify-center"} ${dark ? "dark" : ""}`}
          style={scoreStyle}
          ref={scoreRef}
          role="score"
          aria-label="box"
        >
          {!mobile && (
            <Edges
              scoreKey={scoreKey}
              scores={state.scores}
              action={action}
              preview={preview}
            ></Edges>
          )}
          {!mobile && (
            <div className={`w-[22%] h-full min-w-48`}>
              <EightElements
                scoreKey={scoreKey}
                elements={state.scores[scoreKey].elements}
                feedback={feedback}
                preview={preview}
                dark={dark}
                i18n={i18n}
                textSize={textSize}
                border={border}
                onChange={(elements) => {
                  state.setEightElements(scoreKey, elements);
                }}
              ></EightElements>
            </div>
          )}
          <div
            className={`
              flex justify-center pb-4
            bg-white dark:bg-gray-900
              ${
                mobile
                  ? border
                    ? "border-x-2 border-t-2"
                    : ""
                  : border
                    ? "w-[78%] border-y-2 border-r-2"
                    : "w-[78%]"
              }
            border-gray-300 dark:border-gray-600
            `}
          >
            <div className={`w-2/3`}>
              <MeasurePurposeHeader i18n={i18n} />
              {!preview && state.scores[scoreKey].purposes.length === 0 && (
                <div
                  className={`flex justify-end ${mobile ? "pb-6 pt-3" : "py-3"}`}
                >
                  <AddPurpose
                    mobile={mobile}
                    i18n={i18n}
                    onClick={() => {
                      state.addPurpose(scoreKey);
                      updateAction();
                    }}
                  />
                </div>
              )}
              {state.scores[scoreKey].purposes.map((purpose, purposeIndex) => {
                return (
                  <div
                    className={`
                      flex
                      ${mobile && "mb-2 ml-2 rounded bg-gray-100 pb-2 dark:bg-gray-800"}
                    `}
                    key={`purpose-${purpose.uuid}-list`}
                  >
                    <div
                      className={`
                        w-1/2
                        ${mobile ? "px-2" : "pl-3 pr-6"} 
                        pt-3
                      `}
                    >
                      <ReactSortable
                        list={purpose.measures.map((m) => ({
                          id: m.uuid,
                          ...m,
                        }))}
                        setList={(measures) => {
                          const before = purpose.measures
                            .map((m) => m.uuid)
                            .join();
                          const after = measures.map((m) => m.uuid).join();
                          if (before !== after) {
                            state.setMeasures(scoreKey, purpose.uuid, measures);
                            updateAction();
                          }
                        }}
                        animation={150}
                        delay={2}
                        filter={"textarea"}
                        preventOnFilter={false}
                      >
                        {purpose.measures.map((measure, measureIndex) => (
                          <div
                            key={`measure-${measure.uuid}`}
                            className="pb-1"
                            onClick={updateAction}
                            onBlur={updateAction}
                          >
                            <Measure
                              scoreKey={scoreKey}
                              measure={measure}
                              feedback={feedback}
                              preview={preview}
                              dark={dark}
                              mobile={mobile}
                              i18n={i18n}
                              textSize={textSize}
                              hidden={hideMeasure(
                                purposeIndex,
                                measureIndex,
                                measure.text
                              )}
                              onChange={(measure) => {
                                state.setMeasure(
                                  scoreKey,
                                  purpose.uuid,
                                  measure
                                );
                                updateAction();
                              }}
                              onDelete={(measure) => {
                                state.deleteMeasure(
                                  scoreKey,
                                  purpose.uuid,
                                  measure.uuid
                                );
                                updateAction();
                              }}
                            />
                          </div>
                        ))}
                      </ReactSortable>
                      {!preview && purpose.measures.length === 0 && (
                        <div
                          className={`
                            ${mobile ? "pb-6 pt-1" : "pt-2 pb-9"}
                          `}
                        >
                          <AddMeasure
                            i18n={i18n}
                            onClick={() => {
                              state.addMeasure(scoreKey, purpose.uuid);
                              updateAction();
                            }}
                          ></AddMeasure>
                        </div>
                      )}
                      {!preview && purpose.measures.length > 0 && (
                        <div className="pt-2">
                          <AddMeasureIcon
                            onClick={() => {
                              state.addMeasure(scoreKey, purpose.uuid);
                              updateAction();
                            }}
                          ></AddMeasureIcon>
                        </div>
                      )}
                    </div>
                    <div
                      className={`w-1/2 ${mobile ? "px-1 pt-4" : "px-6 xl:px-14 table " + (preview ? "pt-3" : "pt-1")} `}
                    >
                      <IntermediatePurpose
                        scoreKey={scoreKey}
                        purpose={purpose}
                        index={purposeIndex}
                        count={state.scores[scoreKey].purposes.length}
                        preveMeasureCount={
                          purposeIndex === 0
                            ? 0
                            : state.scores[scoreKey].purposes[purposeIndex - 1]
                                .measures.length
                        }
                        onChange={(purpose) => {
                          state.setPurpose(scoreKey, purpose);
                          updateAction();
                        }}
                        onDelete={(purpose) => {
                          state.deletePurpose(scoreKey, purpose.uuid);
                          updateAction();
                        }}
                        onAdd={() => {
                          state.addPurpose(scoreKey);
                          updateAction();
                        }}
                        onUp={() => {
                          state.swapPurpose(scoreKey, purpose.uuid, -1);
                          updateAction();
                        }}
                        onDown={() => {
                          state.swapPurpose(scoreKey, purpose.uuid, 1);
                          updateAction();
                        }}
                        onAction={updateAction}
                        feedback={feedback}
                        preview={preview}
                        dark={dark}
                        mobile={mobile}
                        i18n={i18n}
                        textSize={textSize}
                      ></IntermediatePurpose>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className={`
                flex w-1/3 flex-col justify-between
                ${mobile ? "px-2 pb-2 pt-10" : "px-2 md:px-4 lg:px-6 xl:px-8 pt-8 pb-4"}
              `}
            >
              <ObjectiveBox
                scoreKey={scoreKey}
                goal={state.scores[scoreKey].winCondition}
                label="WinCondition"
                feedback={feedback}
                preview={preview}
                dark={dark}
                mobile={mobile}
                i18n={i18n}
                textSize={textSize}
                onChange={(objective) => {
                  state.setWinCondition(scoreKey, objective);
                }}
              ></ObjectiveBox>
              {mobile && <Spacer />}
              <ObjectiveBox
                scoreKey={scoreKey}
                goal={state.scores[scoreKey].gainingGoal}
                label="GainingGoal"
                feedback={feedback}
                preview={preview}
                dark={dark}
                mobile={mobile}
                i18n={i18n}
                textSize={textSize}
                onChange={(objective) => {
                  state.setGainingGoal(scoreKey, objective);
                }}
              ></ObjectiveBox>
            </div>
          </div>
          {mobile && (
            <EightElements
              scoreKey={scoreKey}
              elements={state.scores[scoreKey].elements}
              feedback={feedback}
              mobile={mobile}
              dark={dark}
              i18n={i18n}
              textSize={textSize}
              border={border}
              onChange={(elements) => {
                state.setEightElements(scoreKey, elements);
              }}
            ></EightElements>
          )}
        </div>
      ) : (
        <ScoreLoading i18n={i18n} />
      )}
    </>
  );
};

const Spacer = () => {
  return <div className="py-4"></div>;
};

interface ScoreComponentProps {
  i18n: i18n;
}

const MeasurePurposeHeader = ({ i18n }: ScoreComponentProps) => {
  return (
    <div className={`flex`}>
      <div
        className={`
          w-1/2 py-2
          text-center text-gray-500 
          dark:text-gray-300
        `}
      >
        {i18n.t("score.Measure")}
      </div>
      <div
        className={`
          w-1/2 py-2
          text-center
        text-gray-500
        dark:text-gray-300
        `}
      >
        {i18n.t("score.IntermediatePurpose")}
      </div>
    </div>
  );
};

const ScoreLoading = ({ i18n }: ScoreComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <>
      {isLoading ? (
        <div className={`p-12 flex justify-center`} aria-label="loading">
          <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
          <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full mx-4"></div>
          <div className="animate-ping h-2 w-2 bg-blue-600 rounded-full"></div>
        </div>
      ) : (
        <div className={`p-12 text-center text-gray-500 text-lg`}>
          {i18n.t("msg.LoadFailed")}
        </div>
      )}
    </>
  );
};

export const setScore = (key: string, json: string) => {
  if (state && key in state.scores) {
    createCheckers(modelsTI).ProjectScoreModel.check(JSON.parse(json));
    state.setScore(key, JSON.parse(json));
  } else {
    logger.error(`Not found score. key: ${key}`);
  }
};

export const getScoreJson = (key: string) => {
  if (state && key in state.scores) {
    return JSON.stringify(state.scores[key], null, 2);
  } else {
    logger.error(`Not found score. key: ${key}`);
  }
};

export const downloadScore = (
  key: string,
  type: "json" | "png" | "svg",
  fileName?: string
) => {
  if (state && key in state.scores) {
    if (type === "json") {
      const fileData = JSON.stringify(state.scores[key], null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${fileName ?? key}.json`;
      link.href = url;
      link.click();
    } else if (type === "png") {
      const dom = document.querySelector(`#score-${key}`);
      domtoimage
        .toPng(dom!, { quality: 1, bgcolor: "white" })
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.download = `${fileName ?? key}.png`;
          link.href = dataUrl;
          link.click();
        });
    } else if (type === "svg") {
      const dom = document.querySelector(`#score-${key}`);
      domtoimage
        .toSvg(dom!, { quality: 1, bgcolor: "white" })
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.download = `${fileName ?? key}.svg`;
          link.href = dataUrl;
          link.click();
        });
    }
  } else {
    logger.error(`Not found score. key: ${key}`);
  }
};
