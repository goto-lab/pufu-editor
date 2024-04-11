import { useState, ChangeEvent, useEffect } from "react";
import { i18n } from "i18next";
import TextareaAutosize from "react-textarea-autosize";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Comment } from "./Comment";
import { ObjectiveModel, ObjectiveLabel, CommentModel } from "../lib/models";

export interface ObjectiveBoxProps {
  goal: ObjectiveModel;
  label: ObjectiveLabel;
  onChange?: (objective: ObjectiveModel) => void;
  scoreKey?: string;
  feedback?: boolean;
  preview?: boolean;
  dark?: boolean;
  mobile?: boolean;
  i18n?: i18n;
}

export const ObjectiveBox = ({
  goal,
  label,
  onChange,
  scoreKey = "score",
  feedback = false,
  preview = false,
  dark = false,
  mobile = false,
  i18n,
}: ObjectiveBoxProps) => {
  const [text, setText] = useState(goal.text);
  const [comment, setComment] = useState(goal.comment);
  const [showCommentArea, setShowCommentArea] = useState(
    preview && goal.comment.text.length > 0
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange?.({ ...goal, text: e.target.value });
  };
  const handleChangeComment = (comment: CommentModel) => {
    setComment(comment);
    onChange?.({ ...goal, comment });
  };

  const ids = {
    WinCondition: `${scoreKey}-win-condition-${goal.uuid}`,
    GainingGoal: `${scoreKey}-gaining-goal-${goal.uuid}`,
  };
  const role = label === "WinCondition" ? "win-condition" : "gaining-goal";

  useEffect(() => {
    setText(goal.text);
    setComment(goal.comment);
  }, [goal]);

  return (
    <div role={role} aria-label="box">
      {label === "GainingGoal" && (feedback || preview) && showCommentArea && (
        <div className="pb-4 pt-2" role={role} aria-label="comment">
          <Comment
            comment={comment}
            onChange={handleChangeComment}
            preview={preview}
            dark={dark}
            upside={true}
            i18n={i18n}
            rolePrefix={role}
          ></Comment>
        </div>
      )}
      <div
        id={ids[label]}
        className={`
          relative
          min-h-40
          rounded
          border border-gray-400
          px-1
          pt-1
        `}
      >
        <div className={"pl-2 pt-1 text-sm text-gray-500 dark:text-gray-300"}>
          {i18n && i18n.t(`score.${label}`)}
        </div>
        <TextareaAutosize
          className={`
            box-border
            size-full
            resize-none
            px-2 py-1
            text-left
            text-sm
            leading-4
            text-gray-600
            outline-none
            ${mobile && "placeholder:text-xs"}
            placeholder:focus:text-transparent
            dark:bg-gray-900
            dark:text-gray-200
          `}
          minRows={3}
          placeholder={preview ? "" : i18n && i18n.t(`msg.Input${label}`)}
          value={text}
          onChange={handleChange}
          readOnly={preview}
          role={role}
          aria-label="textbox"
        />
        {(feedback || (preview && comment.text)) && (
          <IoChatboxEllipsesOutline
            className={`
              absolute
              ${label === "WinCondition" ? "-bottom-2 -right-1" : "-right-1 -top-3"}
              rounded
            bg-white 
            text-gray-400 
              hover:cursor-pointer
              dark:bg-gray-900
            `}
            size={25}
            onClick={() => {
              setShowCommentArea(!showCommentArea);
            }}
            role={role}
            aria-label="comment-icon"
          />
        )}
      </div>
      {label === "WinCondition" && (feedback || preview) && showCommentArea && (
        <div className="pt-4" role={role} aria-label="comment">
          <Comment
            comment={comment}
            onChange={handleChangeComment}
            preview={preview}
            dark={dark}
            i18n={i18n}
            rolePrefix={role}
          ></Comment>
        </div>
      )}
    </div>
  );
};
