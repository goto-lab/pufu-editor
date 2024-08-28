import { i18n } from "i18next";
import { ElementBox } from "./ElementBox";
import {
  ElementModel,
  EightElementsModel,
  ElementLabel,
  TextSize,
} from "../lib/models";

export interface EightElementsProps {
  elements: EightElementsModel;
  onChange?: (elements: EightElementsModel) => void;
  scoreKey?: string;
  feedback?: boolean;
  preview?: boolean;
  dark?: boolean;
  mobile?: boolean;
  i18n?: i18n;
  textSize?: TextSize;
  border?: boolean;
}

export const EightElements = ({
  elements,
  onChange,
  scoreKey = "score",
  feedback = false,
  preview = false,
  dark = false,
  mobile = false,
  i18n,
  textSize = "small",
  border = true,
}: EightElementsProps) => {
  const handleChange = (element: ElementModel, key: string) => {
    onChange?.({ ...elements, [key]: element });
  };
  const elementKeys = [
    "people",
    "money",
    "time",
    "quality",
    "businessScheme",
    "environment",
    "rival",
    "foreignEnemy",
  ] as ElementLabel[];

  const elementComponents: JSX.Element[] = [];
  type ElementsKey = keyof typeof elements;
  for (const key of elementKeys) {
    elementComponents.push(
      <ElementBox
        element={elements[key as ElementsKey]}
        label={key}
        key={key}
        scoreKey={scoreKey}
        onChange={handleChange}
        feedback={feedback}
        preview={preview}
        dark={dark}
        mobile={mobile}
        i18n={i18n}
        textSize={textSize}
      />
    );
  }
  return (
    <div
      className={`
        ${mobile && "grid grid-cols-2 bg-gray-100 dark:bg-gray-800"}
        ${border ? "border-2" : mobile ? "border-t-2" : "border-r-2"}
        border-gray-300 px-1
        dark:border-gray-600
        pt-1
        bg-white dark:bg-gray-900
        h-full
      `}
      role="elements"
      aria-label="box"
    >
      {elementComponents}
    </div>
  );
};
