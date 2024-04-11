import { create } from "zustand";
import {
  BaseModel,
  EightElementsModel,
  IntermediatePurposeModel,
  MeasureModel,
  ObjectiveModel,
  ProjectScoreModel,
  ProjectScoreMap,
} from "./models";
import { devtools } from "zustand/middleware";
import short from "short-uuid";
import { logger } from "./logger";

export interface ProjectScoreStoreProps {
  scores: ProjectScoreMap;
}

export interface ProjectScoreStore extends ProjectScoreStoreProps {
  setScore: (key: string, score: ProjectScoreModel) => void;
  deleteScore: (key: string) => void;
  setWinCondition: (key: string, winCondition: ObjectiveModel) => void;
  setGainingGoal: (key: string, gainingGocal: ObjectiveModel) => void;
  addPurpose: (key: string) => void;
  setPurpose: (key: string, purpose: IntermediatePurposeModel) => void;
  swapPurpose: (key: string, purposeUuid: string, target: number) => void;
  deletePurpose: (key: string, purposeUuid: string) => void;
  addMeasure: (key: string, purposeUuid: string) => void;
  setMeasures: (
    key: string,
    purposeUuid: string,
    measures: MeasureModel[]
  ) => void;
  setMeasure: (key: string, purposeUuid: string, measure: MeasureModel) => void;
  deleteMeasure: (
    key: string,
    purposeUuid: string,
    measureUuid: string
  ) => void;
  setEightElements: (key: string, elements: EightElementsModel) => void;
}

const defaultValue = () => {
  const value = {
    uuid: short.generate(),
    text: "",
    comment: {
      color: "green",
      text: "",
    },
  } as BaseModel;
  return value;
};

const defaultMeasureValue = () => {
  const value = defaultValue() as MeasureModel;
  value.color = "white";
  return value;
};

export const createScoreKey = () => {
  return short.generate();
};

export const createInitialScoreData = () => {
  return {
    map: {
      winCondition: defaultValue(),
      gainingGoal: defaultValue(),
      purposes: [
        {
          ...defaultValue(),
          measures: [defaultMeasureValue(), defaultMeasureValue()],
        },
      ],
    },
    elements: {
      people: defaultValue(),
      money: defaultValue(),
      time: defaultValue(),
      quality: defaultValue(),
      businessScheme: defaultValue(),
      environment: defaultValue(),
      rival: defaultValue(),
      foreignEnemy: defaultValue(),
    },
  } as ProjectScoreModel;
};

export const createProjectScoreStore = create<ProjectScoreStore>()(
  devtools((set) => ({
    scores: {},
    setScore: (key: string, score: ProjectScoreModel) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        score: ProjectScoreModel
      ): ProjectScoreMap => {
        state.scores[key] = score;
        return state.scores;
      };
      logger.debug(`Set score key: ${key}`);
      set((state) => ({
        scores: _(state, key, score),
      }));
    },
    deleteScore: (key: string) => {
      const _ = (state: ProjectScoreStore, key: string): ProjectScoreMap => {
        if (key in state.scores) {
          delete state.scores[key];
        }
        return state.scores;
      };
      logger.debug(`Delete score key: ${key}`);
      set((state) => ({
        scores: _(state, key),
      }));
    },
    setWinCondition: (key: string, winCondition: ObjectiveModel) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        winCondition: ObjectiveModel
      ): ProjectScoreMap => {
        if (key in state.scores) {
          state.scores[key].map.winCondition = winCondition;
        }
        return state.scores;
      };
      logger.debug(`Set WinCondition.`, winCondition);
      set((state) => ({
        scores: _(state, key, winCondition),
      }));
    },
    setGainingGoal: (key: string, gainingGoal: ObjectiveModel) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        gainingGoal: ObjectiveModel
      ): ProjectScoreMap => {
        if (key in state.scores) {
          state.scores[key].map.gainingGoal = gainingGoal;
        }
        return state.scores;
      };
      logger.debug(`Set GainingGoal.`, gainingGoal);
      set((state) => ({
        scores: _(state, key, gainingGoal),
      }));
    },
    addPurpose: (key: string) => {
      const _ = (key: string, state: ProjectScoreStore): ProjectScoreMap => {
        if (key in state.scores) {
          state.scores[key].map.purposes.push({
            ...defaultValue(),
            measures: [],
          });
        }
        return state.scores;
      };
      logger.debug(`Add purpose.`);
      set((state) => ({
        scores: _(key, state),
      }));
    },
    setPurpose: (key: string, purpose: IntermediatePurposeModel) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purpose: IntermediatePurposeModel
      ): ProjectScoreMap => {
        if (key in state.scores) {
          const index = state.scores[key].map.purposes.findIndex(
            (p) => p.uuid === purpose.uuid
          );
          if (index > -1) {
            state.scores[key].map.purposes[index].text = purpose.text;
            state.scores[key].map.purposes[index].comment = purpose.comment;
          }
        }
        return state.scores;
      };
      logger.debug(`Set purpose.`, purpose);
      set((state) => ({
        scores: _(state, key, purpose),
      }));
    },
    swapPurpose: (key: string, purposeUuid: string, offset: number) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purposeUuid: string,
        offset: number
      ): ProjectScoreMap => {
        if (key in state.scores) {
          const index = state.scores[key].map.purposes.findIndex(
            (p) => p.uuid === purposeUuid
          );
          if (index > -1) {
            const tmp = state.scores[key].map.purposes[index];
            state.scores[key].map.purposes[index] =
              state.scores[key].map.purposes[index + offset];
            state.scores[key].map.purposes[index + offset] = tmp;
          }
        }
        return state.scores;
      };
      logger.debug(`Swap purpose. uuid: ${purposeUuid}, offset: ${offset}`);
      set((state) => ({
        scores: _(state, key, purposeUuid, offset),
      }));
    },
    deletePurpose: (key: string, purposeUuid: string) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purposeUuid: string
      ): ProjectScoreMap => {
        if (key in state.scores) {
          state.scores[key].map.purposes = state.scores[
            key
          ].map.purposes.filter((p) => p.uuid !== purposeUuid);
        }
        return state.scores;
      };
      logger.debug(`Delete purpose. uuid: ${purposeUuid}`);
      set((state) => ({
        scores: _(state, key, purposeUuid),
      }));
    },
    addMeasure: (key: string, purposeUuid: string) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purposeUuid: string
      ): ProjectScoreMap => {
        if (key in state.scores) {
          const index = state.scores[key].map.purposes.findIndex(
            (p) => p.uuid === purposeUuid
          );
          if (index > -1) {
            state.scores[key].map.purposes[index].measures = [
              ...state.scores[key].map.purposes[index].measures,
              defaultMeasureValue(),
            ];
          }
        }
        return state.scores;
      };
      logger.debug(`Add measure.`);
      set((state) => ({
        scores: _(state, key, purposeUuid),
      }));
    },
    setMeasures: (
      key: string,
      purposeUuid: string,
      measures: MeasureModel[]
    ) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purposeUuid: string,
        measures: MeasureModel[]
      ): ProjectScoreMap => {
        if (key in state.scores) {
          const index = state.scores[key].map.purposes.findIndex(
            (p) => p.uuid === purposeUuid
          );
          if (index > -1) {
            state.scores[key].map.purposes[index].measures = measures;
          }
        }
        return state.scores;
      };
      logger.debug(`Set measure. count: ${measures.length}`);
      set((state) => ({
        scores: _(state, key, purposeUuid, measures),
      }));
    },
    setMeasure: (key: string, purposeUuid: string, measure: MeasureModel) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purposeUuid: string,
        measure: MeasureModel
      ): ProjectScoreMap => {
        if (key in state.scores) {
          const measureUuid = measure.uuid;
          const purposeIndex = state.scores[key].map.purposes.findIndex(
            (p) => p.uuid === purposeUuid
          );
          if (purposeIndex > -1) {
            const measureIndex = state.scores[key].map.purposes[
              purposeIndex
            ].measures.findIndex((m) => m.uuid === measureUuid);
            if (measureIndex > -1) {
              state.scores[key].map.purposes[purposeIndex].measures[
                measureIndex
              ].text = measure.text;
              state.scores[key].map.purposes[purposeIndex].measures[
                measureIndex
              ].color = measure.color;
              state.scores[key].map.purposes[purposeIndex].measures[
                measureIndex
              ].comment = measure.comment;
            }
          }
        }
        return state.scores;
      };
      logger.debug(`Set measure.`, measure);
      set((state) => ({ scores: _(state, key, purposeUuid, measure) }));
    },
    deleteMeasure: (key: string, purposeUuid: string, measureUuid: string) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        purposeUuid: string,
        measureUuid: string
      ): ProjectScoreMap => {
        if (key in state.scores) {
          const index = state.scores[key].map.purposes.findIndex(
            (p) => p.uuid === purposeUuid
          );
          if (index > -1) {
            state.scores[key].map.purposes[index].measures = state.scores[
              key
            ].map.purposes[index].measures.filter(
              (m) => m.uuid !== measureUuid
            );
          }
        }
        return state.scores;
      };
      logger.debug(`Delete measure uuid: ${measureUuid}`);
      set((state) => ({
        scores: _(state, key, purposeUuid, measureUuid),
      }));
    },
    setEightElements: (key: string, eightElements: EightElementsModel) => {
      const _ = (
        state: ProjectScoreStore,
        key: string,
        eightElements: EightElementsModel
      ): ProjectScoreMap => {
        if (key in state.scores) {
          state.scores[key].elements = eightElements;
        }
        return state.scores;
      };
      logger.debug(`Set EightElemets.`, eightElements);
      set((state) => ({
        scores: _(state, key, eightElements),
      }));
    },
  }))
);
