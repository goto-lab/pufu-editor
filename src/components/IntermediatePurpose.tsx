import { useState, ChangeEvent, useEffect } from "react";
import { i18n } from "i18next";
import TextareaAutosize from "react-textarea-autosize";
import { GoPlusCircle } from "react-icons/go";
import {
  IoChatboxEllipsesOutline,
  IoCloseSharp,
  IoArrowUpCircleOutline,
  IoArrowDownCircleOutline,
} from "react-icons/io5";
import { Comment } from "./Comment";
import { IntermediatePurposeModel, CommentModel } from "../lib/models";
import { useClickEffect } from "../lib/hooks";

export interface IntermediatePurposeProps {
  purpose: IntermediatePurposeModel;
  index: number;
  count: number;
  preveMeasureCount: number;
  onChange?: (purpose: IntermediatePurposeModel) => void;
  onDelete?: (purpose: IntermediatePurposeModel) => void;
  onAdd?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onAction?: () => void;
  scoreKey?: string;
  feedback?: boolean;
  preview?: boolean;
  dark?: boolean;
  mobile?: boolean;
  i18n?: i18n;
}

export const IntermediatePurpose = ({
  purpose,
  index,
  count,
  preveMeasureCount,
  onChange,
  onDelete,
  onAdd,
  onUp,
  onDown,
  onAction,
  scoreKey = "score",
  feedback = false,
  preview = false,
  dark = false,
  mobile = false,
  i18n,
}: IntermediatePurposeProps) => {
  const [text, setText] = useState(purpose.text);
  const [comment, setComment] = useState(purpose.comment);
  const [showComment, setShowComment] = useState(
    preview && purpose.comment.text.length > 0
  );
  const [active, setActive] = useState(false);
  const insideRef = useClickEffect(
    () => setActive(true),
    () => setActive(false)
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange?.({ ...purpose, text: e.target.value });
  };
  const handleChangeComment = (comment: CommentModel) => {
    setComment(comment);
    onChange?.({ ...purpose, comment });
  };

  const handleDelete = () => {
    onDelete?.(purpose);
  };

  useEffect(() => {
    setText(purpose.text);
    setComment(purpose.comment);
  }, [purpose]);

  return (
    <div
      role="purpose"
      aria-label="box"
      className={`${!mobile && "table-cell align-middle"}`}
    >
      <div className={`relative`}>
        {!preview && index > 0 && active && (
          <UpPurposeIcon onClick={onUp} wideMargin={preveMeasureCount > 1} />
        )}
      </div>
      <div
        id={`${scoreKey}-purpose-${purpose.uuid}`}
        className={`
          relative
          border
          border-solid border-gray-400
          bg-white
          p-2
          text-center
          dark:bg-gray-900
       `}
        style={{
          borderRadius: mobile ? "5px" : "50%",
        }}
        ref={insideRef}
      >
        <TextareaAutosize
          className={`
            no-scrollbar
            w-full
            resize-none
            overflow-y-auto
            rounded-l
            bg-transparent
            py-2
            text-center
            text-sm
            leading-4
            text-gray-600
            outline-none
            ${mobile && "placeholder:text-xs"}
            align-middle
            placeholder:focus:text-transparent
            dark:text-gray-200
          `}
          minRows={1}
          placeholder={preview ? "" : i18n && i18n.t("msg.InputPurpose")}
          value={text}
          onChange={handleChange}
          readOnly={preview}
          role="purpose"
          aria-label="textbox"
        />
        {!preview && active && (
          <IoCloseSharp
            className={`
              absolute
              -right-1 -top-1
              rounded-full
            bg-white text-gray-400 
              hover:cursor-pointer
            dark:bg-gray-900
            `}
            onClick={handleDelete}
            role="purpose"
            aria-label="delete-icon"
          />
        )}
        {(feedback || (preview && comment.text)) && (
          <IoChatboxEllipsesOutline
            className={`
              absolute
              ${mobile ? "-bottom-2 -right-1" : "-bottom-2 right-1"}
              rounded-md
              bg-white
              text-gray-400
              hover:cursor-pointer
              dark:bg-gray-900
            `}
            size={25}
            onClick={() => {
              setShowComment(!showComment);
              onAction && onAction();
            }}
            role="purpose"
            aria-label="comment-icon"
          />
        )}
      </div>
      {(preview || feedback) && showComment && (
        <div className="pt-4" role="purpose" aria-label="comment">
          <Comment
            comment={comment}
            onChange={handleChangeComment}
            preview={preview}
            dark={dark}
            i18n={i18n}
            rolePrefix="purpose"
          ></Comment>
        </div>
      )}
      <div className={`relative mb-4 pt-2`}>
        {!preview && active && index < count - 1 && (
          <DownPurposeIcon
            onClick={onDown}
            wideMargin={purpose.measures.length > 1}
          />
        )}
        {!preview && index >= count - 1 && (
          <AddPurposeIcon onClick={onAdd} showComment={showComment} />
        )}
      </div>
    </div>
  );
};

export interface AddPurposeProps {
  i18n?: i18n;
  mobile?: boolean;
  onClick?: () => void;
  showComment?: boolean;
}

export const AddPurpose = ({
  i18n,
  onClick,
  mobile = false,
}: AddPurposeProps) => {
  return (
    <div
      className={`
        relative 
        mx-4
        w-5/12 border-2 border-dashed
        border-gray-300
        py-4
        text-center text-sm
        text-gray-400
        hover:cursor-pointer
        dark:text-gray-300
      `}
      style={{
        borderRadius: mobile ? "5px" : "50%",
      }}
      onClick={onClick}
      role="purpose"
      aria-label="add-box"
    >
      {i18n && i18n.t("msg.AddPurpose")}
    </div>
  );
};

export const AddPurposeIcon = ({
  onClick,
  showComment = false,
}: AddPurposeProps) => {
  return (
    <GoPlusCircle
      className={`
        absolute
        ${showComment ? "-bottom-10" : "-bottom-6"}
        left-[43%]
        mx-auto 
      text-gray-300
        hover:cursor-pointer hover:text-gray-400
      `}
      size={25}
      onClick={onClick}
      role="purpose"
      aria-label="add-icon"
    />
  );
};

export interface ActionIconProps {
  onClick?: () => void;
  wideMargin?: boolean;
}

export const UpPurposeIcon = ({ onClick, wideMargin }: ActionIconProps) => {
  return (
    <IoArrowUpCircleOutline
      className={`
        absolute
        ${wideMargin ? "-top-8" : "-top-6"}
        left-[43%]
        mx-auto 
      text-gray-300 
        hover:cursor-pointer 
      hover:text-gray-400
      `}
      size={28}
      onClick={onClick}
      role="purpose"
      aria-label="up-icon"
    />
  );
};

export const DownPurposeIcon = ({ onClick, wideMargin }: ActionIconProps) => {
  return (
    <IoArrowDownCircleOutline
      className={`
        absolute
        ${wideMargin ? "-bottom-8" : "-bottom-6"}
        left-[43%]
        mx-auto 
      text-gray-300
        hover:cursor-pointer
      hover:text-gray-400
      `}
      size={28}
      onClick={onClick}
      role="purpose"
      aria-label="down-icon"
    />
  );
};
