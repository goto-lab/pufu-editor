import { MeasureModel } from "./models";

// 編集時は従来の本文による共有を維持し、プレビュー時は表示内容全体で判定する。
export const getMeasureKey = (
  measure: MeasureModel,
  preview: boolean,
): string =>
  preview
    ? JSON.stringify([
        measure.text,
        measure.color,
        measure.progress,
        measure.comment.text,
        measure.comment.color,
      ])
    : measure.text;
