import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  showProgress?: boolean;
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
  showProgress = false,
  lang = "ja",
  textSize = "small",
  width,
  border = true,
}: ProjectScoreProps) => {
  const [scoreKey] = useState(uniqueKey ?? createScoreKey());
  const scoreRef = useRef<HTMLDivElement | null>(null);

  const [action, setAction] = useState(0);
  const updateAction = () => {
    setAction((prev) => prev + 1);
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
            .reduce((a, b) => a || b, false);
        })
        .reduce((a, b) => a || b, false);
    }
    return false;
  };

  // 2カラム表示かどうかを判定（施策エリアの幅が十分ある場合のみ）
  const [isTwoColumn, setIsTwoColumn] = useState(false);
  const observerRef = useRef<ResizeObserver | null>(null);
  const measuresRef = useCallback((node: HTMLDivElement | null) => {
    // 前のobserverをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!node || mobile) {
      setIsTwoColumn(false);
      return;
    }
    const checkWidth = () => {
      // 施策エリア（w-1/2）の幅が280px未満なら1カラムに切り替え
      const measuresWidth = node.clientWidth / 2;
      setIsTwoColumn(measuresWidth >= 280);
    };
    checkWidth();
    observerRef.current = new ResizeObserver(checkWidth);
    observerRef.current.observe(node);
  }, [mobile]);

  // カラム数変更時にEdgesの線を再描画（DOM確定後に実行）
  useEffect(() => {
    requestAnimationFrame(() => {
      updateAction();
    });
  }, [isTwoColumn]);

  // 右列（中間目的に近い列）の施策UUIDを算出（2カラム時、線の接続対象）
  // actionを依存配列に含めることで施策の追加・削除・並び替え時にも再計算される
  const connectMeasureUuids = useMemo(() => {
    if (!isTwoColumn || !(scoreKey in state.scores)) return undefined;
    const uuids = new Set<string>();

    // 共有施策テキストを特定（複数purposeに存在するテキスト）
    const textPurposeCount = new Map<string, number>();
    state.scores[scoreKey].purposes.forEach((p) => {
      const seen = new Set<string>();
      p.measures.forEach((m) => {
        if (m.text && !seen.has(m.text)) {
          seen.add(m.text);
          textPurposeCount.set(m.text, (textPurposeCount.get(m.text) || 0) + 1);
        }
      });
    });
    const isSharedText = (text: string) => text && (textPurposeCount.get(text) || 0) > 1;

    state.scores[scoreKey].purposes.forEach((p) => {
      // 共有施策は常に右列（接続対象）
      // 通常施策は2カラムグリッドの右列のみ接続対象
      const normalMeasures = p.measures.filter((m) => !isSharedText(m.text));
      const count = normalMeasures.length;
      normalMeasures.forEach((m, idx) => {
        if (count <= 1 || idx % 2 === 1 || idx === count - 1) {
          uuids.add(m.uuid);
        }
      });
      // 共有施策は常に接続対象
      p.measures.forEach((m) => {
        if (isSharedText(m.text)) {
          uuids.add(m.uuid);
        }
      });
    });
    return uuids;
  }, [scoreKey, isTwoColumn, action, state.scores]);

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
          className={`relative ${border ? "border-2" : ""} ${mobile ? "px-4" : "flex justify-center"} ${dark ? "dark" : ""}`}
          style={scoreStyle}
          ref={scoreRef}
          onMouseEnter={updateAction}
          onClick={updateAction}
          role="score"
          aria-label="box"
        >
          {!mobile && (
            <Edges
              scoreKey={scoreKey}
              scores={state.scores}
              action={action}
              preview={preview}
              connectMeasureUuids={connectMeasureUuids}
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
              ${mobile ? "" : "w-[78%] border-l-2"}
            border-gray-300 dark:border-gray-600
            `}
          >
            <div className={`w-2/3`} ref={measuresRef}>
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
                // 共有施策の判定（他のpurposeにも同じテキストが存在するか）
                const otherTexts = new Set<string>();
                state.scores[scoreKey].purposes.forEach((p, pIdx) => {
                  if (pIdx !== purposeIndex) {
                    p.measures.forEach((m) => {
                      if (m.text) otherTexts.add(m.text);
                    });
                  }
                });
                const isSharedMeasure = (text: string) => text && otherTexts.has(text);
                // 共有施策は最初のpurposeでのみ表示
                const isFirstPurposeForText = (text: string) => {
                  for (const p of state.scores[scoreKey].purposes) {
                    if (p.measures.some((m) => m.text === text)) return p.uuid === purpose.uuid;
                  }
                  return false;
                };

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
                        w-1/2 overflow-hidden
                        ${mobile ? "px-2" : "pl-3 pr-3"}
                        pt-3
                      `}
                    >
                      {preview && isTwoColumn ? (
                        /* プレビュー+2カラム時: 通常施策は2カラム、共有施策は右寄せ */
                        <div className="grid grid-cols-2 gap-x-2">
                          {(() => {
                            const normalMeasures = purpose.measures
                              .filter((m) => !isSharedMeasure(m.text));
                            const items: React.ReactNode[] = [];
                            let colPos = 0; // 現在のグリッド列位置（0=左, 1=右）
                            let normalIdx = 0;
                            purpose.measures.forEach((m) => {
                              const shared = isSharedMeasure(m.text);
                              if (shared && !isFirstPurposeForText(m.text)) return;
                              if (shared) {
                                // 共有施策は右列に配置。左列にいる場合のみスペーサー挿入
                                if (colPos % 2 === 0) {
                                  items.push(<div key={`spacer-${m.uuid}`} />);
                                  colPos++;
                                }
                                items.push(
                                  <div key={`measure-${m.uuid}`} className="pb-1">
                                    <Measure scoreKey={scoreKey} measure={m}
                                      feedback={feedback} preview={preview} dark={dark}
                                      mobile={mobile} showProgress={showProgress}
                                      i18n={i18n} textSize={textSize} hidden={false} />
                                  </div>
                                );
                                colPos++;
                              } else {
                                // 通常施策の最後が左列に来る場合、右寄せ
                                const isLastNormal = normalIdx === normalMeasures.length - 1;
                                const normalIsOdd = normalMeasures.length % 2 === 1;
                                if (isLastNormal && normalIsOdd && colPos % 2 === 0) {
                                  items.push(<div key={`spacer-${m.uuid}`} />);
                                  colPos++;
                                }
                                items.push(
                                  <div key={`measure-${m.uuid}`} className="pb-1">
                                    <Measure scoreKey={scoreKey} measure={m}
                                      feedback={feedback} preview={preview} dark={dark}
                                      mobile={mobile} showProgress={showProgress}
                                      i18n={i18n} textSize={textSize} hidden={false} />
                                  </div>
                                );
                                colPos++;
                                normalIdx++;
                              }
                            });
                            return items;
                          })()}
                        </div>
                      ) : (
                        /* 編集モードまたは1カラム時 */
                        <ReactSortable
                          className={`${isTwoColumn ? 'grid grid-cols-2 gap-x-2' : ''}`}
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
                          filter={"textarea,input"}
                          preventOnFilter={false}
                        >
                          {(() => {
                            const normalMeasures = purpose.measures
                              .filter((m) => !isSharedMeasure(m.text));
                            let normalIdx = 0;
                            return purpose.measures.map((measure, measureIndex) => {
                              const shared = isTwoColumn && isSharedMeasure(measure.text);
                              let rightAlign = shared;
                              if (!shared && isTwoColumn) {
                                const isLastNormal = normalIdx === normalMeasures.length - 1;
                                const normalIsOdd = normalMeasures.length % 2 === 1;
                                if (isLastNormal && normalIsOdd) rightAlign = true;
                                normalIdx++;
                              }
                              return (
                            <div
                              key={`measure-${measure.uuid}`}
                              className={`pb-1 ${rightAlign ? 'col-start-2' : ''}`}
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
                                showProgress={showProgress}
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
                              );
                            });
                          })()}
                        </ReactSortable>
                      )}
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
    const parsed = JSON.parse(json);
    // purposesが配列でない場合は空配列にし、施策のcolorが未設定の場合はデフォルト値を設定
    if (!Array.isArray(parsed.purposes)) {
      parsed.purposes = [];
    }
    parsed.purposes.forEach((purpose: { measures?: unknown }) => {
      if (!Array.isArray(purpose?.measures)) {
        if (purpose) purpose.measures = [];
        return;
      }
      purpose.measures.forEach((measure: { color?: string; progress?: number } | null) => {
        if (measure && !measure.color) {
          measure.color = 'white';
        }
        // 進捗値のバリデーション
        if (measure && measure.progress !== undefined) {
          measure.progress = Math.max(0, Math.min(100, measure.progress));
        }
      });
    });
    createCheckers(modelsTI).ProjectScoreModel.check(parsed);
    state.setScore(key, parsed);
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

export const getScoreMarkdown = (key: string) => {
  const replaceNL = (prefix: string, text: string) => {
    return `${prefix}${text.replaceAll(/\n/g, "<br>")}\n`;
  };
  let markdown = "";
  if (state && key in state.scores) {
    const score = state.scores[key];
    markdown += replaceNL("- 獲得目標: ", score.gainingGoal.text);
    if (score.gainingGoal.comment.text) {
      markdown += replaceNL(
        "  - 獲得目標のコメント: ",
        score.gainingGoal.comment.text
      );
    }
    markdown += replaceNL("- 勝利目標: ", score.winCondition.text);
    if (score.winCondition.comment.text) {
      markdown += replaceNL(
        "  - 勝利目標のコメント: ",
        score.winCondition.comment.text
      );
    }
    if (score.purposes.length > 0) {
      markdown += score.purposes
        .map((purpose, purposeIndex) => {
          let purposeText = replaceNL(
            `  - 中間目的${purposeIndex + 1}: `,
            purpose.text
          );
          if (purpose.comment.text) {
            purposeText += replaceNL(
              `    - 中間目的${purposeIndex + 1}のコメント: `,
              purpose.comment.text
            );
          }
          if (purpose.measures.length > 0) {
            purposeText += purpose.measures
              .map((measure, measureIndex) => {
                let measureText = replaceNL(
                  `    - 施策${purposeIndex + 1}-${measureIndex + 1}: `,
                  measure.text + (measure.progress !== undefined ? ` (${measure.progress}%)` : '')
                );
                if (measure.comment.text) {
                  measureText += replaceNL(
                    `      - 施策${purposeIndex + 1}-${measureIndex + 1}のコメント: `,
                    measure.comment.text
                  );
                }
                return measureText;
              })
              .join("");
          }
          return purposeText;
        })
        .join("");
    }
    markdown += `- 廟算八要素\n`;
    markdown += replaceNL("  - ひと: ", score.elements.people.text);
    if (score.elements.people.comment.text) {
      markdown += replaceNL(
        "    - ひとのコメント: ",
        score.elements.people.comment.text
      );
    }
    markdown += replaceNL("  - お金: ", score.elements.money.text);
    if (score.elements.money.comment.text) {
      markdown += replaceNL(
        "    - お金のコメント: ",
        score.elements.money.comment.text
      );
    }
    markdown += replaceNL("  - 時間: ", score.elements.time.text);
    if (score.elements.time.comment.text) {
      markdown += replaceNL(
        "    - 時間のコメント: ",
        score.elements.time.comment.text
      );
    }
    markdown += replaceNL("  - クオリティ: ", score.elements.quality.text);
    if (score.elements.quality.comment.text) {
      markdown += replaceNL(
        "    - クオリティのコメント: ",
        score.elements.quality.comment.text
      );
    }
    markdown += replaceNL(
      "  - 商流 / 座組: ",
      score.elements.businessScheme.text
    );
    if (score.elements.businessScheme.comment.text) {
      markdown += replaceNL(
        "    - 商流 / 座組のコメント: ",
        score.elements.businessScheme.comment.text
      );
    }
    markdown += replaceNL("  - 環境: ", score.elements.environment.text);
    if (score.elements.environment.comment.text) {
      markdown += replaceNL(
        "    - 環境のコメント: ",
        score.elements.environment.comment.text
      );
    }
    markdown += replaceNL("  - ライバル: ", score.elements.rival.text);
    if (score.elements.rival.comment.text) {
      markdown += replaceNL(
        "    - ライバルのコメント: ",
        score.elements.rival.comment.text
      );
    }
    markdown += replaceNL("  - 外敵: ", score.elements.foreignEnemy.text);
    if (score.elements.foreignEnemy.comment.text) {
      markdown += replaceNL(
        "    - 外敵のコメント: ",
        score.elements.foreignEnemy.comment.text
      );
    }
  } else {
    logger.error(`Not found score. key: ${key}`);
  }
  return markdown;
};

export const downloadScore = (
  key: string,
  type: "json" | "markdown" | "png" | "svg",
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
    } else if (type === "markdown") {
      const fileData = getScoreMarkdown(key);
      const blob = new Blob([fileData], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${fileName ?? key}.md`;
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
