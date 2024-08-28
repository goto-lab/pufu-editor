import { useState, ChangeEvent, useEffect } from "react";
import { i18n } from "i18next";
import TextareaAutosize from "react-textarea-autosize";
import {
  IoChatboxEllipsesOutline,
  IoColorPaletteOutline,
  IoCloseSharp,
} from "react-icons/io5";
import { GoPlusCircle } from "react-icons/go";
import { RxDotFilled } from "react-icons/rx";
import { MdDragIndicator } from "react-icons/md";
import { Comment } from "./Comment";
import {
  MeasureModel,
  MeasureColor,
  CommentModel,
  TextSize,
} from "../lib/models";
import { useClickEffect, useTextSize } from "../lib/hooks";

export interface MeasureProps {
  measure: MeasureModel;
  hidden?: boolean;
  onChange?: (measure: MeasureModel) => void;
  onDelete?: (measure: MeasureModel) => void;
  scoreKey?: string;
  feedback?: boolean;
  preview?: boolean;
  dark?: boolean;
  mobile?: boolean;
  i18n?: i18n;
  textSize?: TextSize;
}

export const Measure = ({
  measure,
  hidden = false,
  onChange,
  onDelete,
  scoreKey = "score",
  feedback = false,
  preview = false,
  dark = false,
  mobile = false,
  i18n,
  textSize = "small",
}: MeasureProps) => {
  const [text, setText] = useState(measure.text);
  const [color, setColor] = useState(measure.color);
  const [comment, setComment] = useState(measure.comment);
  const [showComment, setShowComment] = useState(
    preview && measure.comment.text.length > 0
  );
  const [colorPick, setColorPick] = useState(false);
  const [active, setActive] = useState(false);
  const insideRef = useClickEffect(
    () => setActive(true),
    () => setActive(false)
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange?.({ ...measure, text: e.target.value });
  };

  const handleDelete = () => {
    onDelete?.(measure);
  };

  const handleChangeComment = (comment: CommentModel) => {
    setComment(comment);
    onChange?.({ ...measure, comment });
  };

  const handleColor = (color: MeasureColor) => {
    setColor(color);
    onChange?.({ ...measure, color });
  };

  const colors = {
    white: {
      border: "border-gray-400",
      icon: "text-gray-400",
      pallet: "text-gray-400",
      bg: "bg-white dark:bg-gray-900",
    },
    blue: {
      border: "border-sky-400",
      icon: "text-sky-400",
      pallet: "text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-900",
    },
    green: {
      border: "border-green-500",
      icon: "text-green-500",
      pallet: "text-green-400",
      bg: "bg-green-50 dark:bg-green-900",
    },
    red: {
      border: "border-red-300",
      icon: "text-red-300",
      pallet: "text-red-400",
      bg: "bg-red-50 dark:bg-red-900",
    },
    yellow: {
      border: "border-yellow-500",
      icon: "text-yellow-500",
      pallet: "text-yellow-400",
      bg: "bg-yellow-50 dark:bg-yellow-900",
    },
  };

  const textSizeStyle = useTextSize(textSize);

  useEffect(() => {
    setText(measure.text);
    setColor(measure.color);
    setComment(measure.comment);
  }, [measure]);

  return hidden ? (
    <div id={`${scoreKey}-measure-${measure.uuid}`}></div>
  ) : (
    <div
      className={`
        ${mobile ? "py-1" : "pt-2"}
      `}
    >
      <div
        id={`${scoreKey}-measure-${measure.uuid}`}
        className={`
          relative
          rounded
          border px-1 py-2
          text-center 
        ${colors[color].border}
        ${colors[color].bg}
      `}
        ref={insideRef}
        role="measure"
        aria-label="box"
      >
        <TextareaAutosize
          className={`
            no-scrollbar
            box-border
            w-11/12
            resize-none
            overflow-visible
            bg-transparent
            py-1
            text-left
            ${textSizeStyle}
            leading-4
            text-gray-600
            outline-none
            ${mobile && "placeholder:text-xs"}
            align-middle
            placeholder:focus:text-transparent
            dark:text-gray-200
          `}
          minRows={1}
          placeholder={preview ? "" : i18n && i18n.t("msg.InputMeasure")}
          value={text}
          onChange={handleChange}
          readOnly={preview}
          role="measure"
          aria-label="textbox"
        />
        {!preview && (
          <MdDragIndicator
            className={`absolute
             -left-2 rounded-full
             bg-white dark:bg-gray-900 
             ${colors[color].icon}
             hover:cursor-grab active:cursor-grabbing`}
            style={{ top: "35%" }}
          />
        )}
        {!preview && active && (
          <IoCloseSharp
            className={`absolute -right-2 -top-2 rounded-full
             bg-white dark:bg-gray-900 ${colors[color].icon} hover:cursor-pointer`}
            onClick={handleDelete}
            role="measure"
            aria-label="delete-icon"
          />
        )}
        {!preview && active && (
          <IoColorPaletteOutline
            className={`
              absolute 
              -bottom-3 -left-2
              rounded-full
              bg-white
              ${colors[color].icon}
              hover:cursor-pointer
              dark:bg-gray-900 
              z-20
            `}
            size={24}
            onClick={() => {
              setColorPick(!colorPick);
              if (showComment) {
                setShowComment(false);
              }
            }}
            role="measure"
            aria-label="palette-icon"
          />
        )}
        {!preview && active && colorPick && (
          <div
            className={`
              absolute -bottom-7 left-0
              flex items-center justify-center gap-0
              pl-3 pr-2 border bg-white rounded
              z-10
              dark:bg-gray-900
            `}
          >
            {["red", "green", "blue", "yellow", "white"].map((c) => {
              return (
                <RxDotFilled
                  key={`color-icon-${c}`}
                  className={`${colors[c as MeasureColor].pallet} hover:cursor-pointer ml-1`}
                  size={22}
                  onClick={() => handleColor(c as MeasureColor)}
                  role="measure"
                  aria-label={`color-icon-${c}`}
                />
              );
            })}
          </div>
        )}
        {(feedback || (preview && comment.text)) && (
          <IoChatboxEllipsesOutline
            className={`
              absolute -bottom-2 -right-1
              rounded-md bg-white 
              dark:bg-gray-900 
              ${colors[color].icon} hover:cursor-pointer
            `}
            size={25}
            onClick={() => {
              setShowComment(!showComment);
              setColorPick(false);
            }}
            role="measure"
            aria-label="comment-icon"
          />
        )}
      </div>
      {(feedback || preview) && showComment && (
        <div className="pt-4" role="measure" aria-label="comment">
          <Comment
            comment={comment}
            onChange={handleChangeComment}
            preview={preview}
            dark={dark}
            i18n={i18n}
            textSize={textSize}
            rolePrefix="measure"
          ></Comment>
        </div>
      )}
    </div>
  );
};

export interface AddMeasureProps {
  i18n?: i18n;
  onClick?: () => void;
  mobile?: boolean;
}

export const AddMeasure = ({ i18n, onClick }: AddMeasureProps) => {
  return (
    <div
      className={`
        relative
        z-10
        rounded border-2 border-dashed
        border-gray-300
        py-3 text-center
        text-sm
        text-gray-400
          hover:cursor-pointer
       dark:text-gray-300
      `}
      onClick={onClick}
      role="measure"
      aria-label="add-box"
    >
      {i18n && i18n.t("msg.AddMeasure")}
    </div>
  );
};

export const AddMeasureIcon = ({ onClick }: AddMeasureProps) => {
  return (
    <GoPlusCircle
      className={`
        mx-auto
      text-gray-300
        hover:cursor-pointer hover:text-gray-400
      `}
      size={26}
      onClick={onClick}
      role="measure"
      aria-label="add-icon"
    />
  );
};
