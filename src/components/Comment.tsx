import { useState, ChangeEvent } from "react";
import { i18n } from "i18next";
import TextareaAutosize from "react-textarea-autosize";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxDotFilled } from "react-icons/rx";
import { CommentModel, CommentColor } from "../lib/models";
import { useClickEffect } from "../lib/hooks";
import styles from "./Comment.module.css";

export interface CommentProps {
  comment: CommentModel;
  onChange?: (comment: CommentModel) => void;
  preview?: boolean;
  dark?: boolean;
  upside?: boolean;
  i18n?: i18n;
  rolePrefix?: string;
}

export const Comment = ({
  comment,
  onChange,
  preview = false,
  upside = false,
  dark = false,
  i18n,
  rolePrefix = "",
}: CommentProps) => {
  const [text, setText] = useState(comment.text);
  const [color, setColor] = useState(comment.color);
  const [colorPick, setColorPick] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const insideRef = useClickEffect(
    () => setShowPicker(true),
    () => setShowPicker(false)
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange?.({ ...comment, text: e.target.value });
  };

  const handleColor = (color: CommentColor) => {
    setColor(color);
    onChange?.({ ...comment, color });
  };

  const colors = {
    gray: {
      icon: "text-gray-500",
    },
    blue: {
      icon: "text-sky-400",
    },
    green: {
      icon: "text-green-400",
    },
    red: {
      icon: "text-red-300",
    },
  };
  const role = rolePrefix === "" ? "comment" : `${rolePrefix}-comment`;
  return (
    <div
      className={`
        relative
        px-1 pt-1
        text-center
        ${styles[upside ? "comment-upside" : "comment"]}
        ${styles[upside ? color + "-upside" : color]}
        ${styles[dark ? (upside ? color + "-upside-dark" : color + "-dark") : ""]}
        dark:bg-gray-900
      `}
      ref={insideRef}
      role={role}
      aria-label="box"
    >
      <TextareaAutosize
        className={`
          box-border
          w-full
          resize-none
          py-2
          text-left
          text-sm
          leading-4
          text-gray-600
          outline-none
          dark:text-gray-200 
          ${styles[color]}
          placeholder:focus:text-transparent
          ${preview && "placeholder:text-transparent"}
          dark:bg-gray-900
        `}
        placeholder={preview ? "" : i18n && i18n.t("msg.InputComment")}
        value={text}
        onChange={handleChange}
        readOnly={preview}
        role={role}
        aria-label="textbox"
      />
      {!preview && showPicker && (
        <IoColorPaletteOutline
          className={`
          absolute 
          -bottom-2 -left-2
          rounded-full
          bg-white
          dark:bg-gray-900 
          ${colors[color].icon}
          hover:cursor-pointer
          z-20
        `}
          size={24}
          onClick={() => {
            setColorPick(!colorPick);
          }}
          role={role}
          aria-label="palette-icon"
        />
      )}
      {!preview && showPicker && colorPick && (
        <div
          className={`
            absolute
            -bottom-7 left-0
            flex items-center justify-center gap-0
            px-2
            border bg-white rounded
            z-10
            dark:bg-gray-900
          `}
        >
          <RxDotFilled
            className={`text-red-400 hover:cursor-pointer mx-1`}
            size={22}
            onClick={() => handleColor("red")}
            role={role}
            aria-label="color-icon-red"
          />
          <RxDotFilled
            className={`text-green-400 hover:cursor-pointer mx-1`}
            size={22}
            onClick={() => handleColor("green")}
            role={role}
            aria-label="color-icon-green"
          />
          <RxDotFilled
            className={`text-sky-400 hover:cursor-pointer mx-1`}
            size={22}
            onClick={() => handleColor("blue")}
            role={role}
            aria-label="color-icon-blue"
          />
        </div>
      )}
    </div>
  );
};
