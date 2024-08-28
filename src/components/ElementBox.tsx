import { useState, ChangeEvent, useEffect } from "react";
import { i18n } from "i18next";
import TextareaAutosize from "react-textarea-autosize";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Comment } from "./Comment";
import {
  ElementModel,
  ElementLabel,
  CommentModel,
  TextSize,
} from "../lib/models";
import { useTextSize } from "../lib/hooks";

export interface ElementBoxProps {
  scoreKey: string;
  element: ElementModel;
  label: ElementLabel;
  onChange?: (element: ElementModel, key: string) => void;
  feedback?: boolean;
  preview?: boolean;
  dark?: boolean;
  mobile?: boolean;
  i18n?: i18n;
  textSize?: TextSize;
}

export const ElementBox = ({
  scoreKey,
  element,
  label,
  onChange,
  feedback = false,
  preview = false,
  dark = false,
  mobile = false,
  i18n,
  textSize = "small",
}: ElementBoxProps) => {
  const [text, setText] = useState(element.text);
  const [comment, setComment] = useState(element.comment);
  const [showComment, setShowComment] = useState(
    preview && element.comment.text.length > 0
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange?.({ ...element, text: e.target.value }, label);
  };

  const handleChangeComment = (comment: CommentModel) => {
    setComment(comment);
    onChange?.({ ...element, comment }, label);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const textSizeStyle = useTextSize(textSize);

  useEffect(() => {
    setText(element.text);
    setComment(element.comment);
  }, [element]);

  return (
    <div className="pb-3" role="element" aria-label={label}>
      <div
        id={`${scoreKey}-element-${label}`}
        className={`
          relative
          border-gray-400
          pl-1 pt-1 
          ${showComment ? "pb-3" : "pb-1"}
        `}
      >
        <div className={"flex justify-between bg-white pl-1 dark:bg-gray-900"}>
          <div className={`text-sm text-gray-500 dark:text-gray-300`}>
            {i18n ? i18n.t(`score.${capitalize(label)}`) : capitalize(label)}
          </div>
          {(feedback || (preview && comment.text)) && (
            <IoChatboxEllipsesOutline
              className={`
                rounded
              bg-white 
              text-gray-300
                hover:cursor-pointer
              hover:text-gray-400
              dark:bg-gray-900 
              `}
              size={25}
              onClick={() => {
                setShowComment(!showComment);
              }}
              role="element"
              aria-label={`comment-icon-${label}`}
            />
          )}
        </div>
        <TextareaAutosize
          className={`
            box-border
            size-full
            resize-none
            pl-1 pt-1
            text-left
            ${textSizeStyle}
            leading-4
            text-gray-600
            outline-none
            placeholder:focus:text-transparent
            ${preview && "placeholder:text-transparent"}
            dark:bg-gray-900
            dark:text-gray-200
          `}
          minRows={1}
          placeholder={
            preview ? "" : i18n && i18n.t(`msg.Input${capitalize(label)}`)
          }
          value={text}
          onChange={handleChange}
          readOnly={preview}
          role="element"
          aria-label={`${label}-textbox`}
        />
      </div>
      {(feedback || preview) && showComment && (
        <div
          className={`${mobile && "mx-1"} pb-4`}
          role="element"
          aria-label={`comment-${label}`}
        >
          <Comment
            comment={comment}
            onChange={handleChangeComment}
            preview={preview}
            dark={dark}
            i18n={i18n}
            rolePrefix={label}
          ></Comment>
        </div>
      )}
    </div>
  );
};
