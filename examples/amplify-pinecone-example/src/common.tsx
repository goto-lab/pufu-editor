import React from "react";

export type ModalProps = {
  open: boolean;
  onCancel: () => void;
  text: string;
  error: string;
  onOk: () => void;
  onChange: (text: string) => void;
};

export const ModalDialog = (props: ModalProps) => {
  return props.open ? (
    <>
      <div className="absolute left-1/2 top-1/3 z-20 flex size-3/5 -translate-x-1/2 -translate-y-1/2 flex-col items-start border-2 bg-white p-5 shadow-md">
        <h1 className="mb-5 text-xl font-bold">Import data</h1>
        <div className="py-2">
          <input
            className="cursor-pointer"
            type="file"
            accept=".json"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const files = event.currentTarget.files;
              if (!files || files?.length === 0) return;
              const file = files[0];
              const reader = new FileReader();
              reader.addEventListener("load", () => {
                props.onChange(
                  typeof reader.result === "string"
                    ? reader.result
                    : "Not load."
                );
              });
              reader.readAsText(file, "UTF-8");
            }}
          />
        </div>
        <textarea
          id="modal-textarea"
          className="size-full"
          value={props.text}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        ></textarea>
        <p className="text-red-500 py-1">{props.error}</p>
        <div className="mt-auto flex w-full py-3">
          <button
            className="mx-auto bg-sky-500 px-8 py-2 text-white hover:bg-sky-700 rounded"
            onClick={() => props.onOk()}
          >
            Import
          </button>
          <button
            className="mx-auto bg-sky-500 px-8 py-2 text-white hover:bg-sky-700 rounded"
            onClick={() => props.onCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
      <div
        className="fixed z-10 size-full"
        onClick={() => props.onCancel()}
      ></div>
    </>
  ) : (
    <></>
  );
};

export type ImportButtonProps = {
  onClick: () => void;
};
export const ImportButton = ({ onClick }: ImportButtonProps) => {
  return (
    <button
      style={{
        margin: "10px",
        padding: "4px 8px",
        color: "#fff",
        backgroundColor: "#168dff",
        borderRadius: "6px",
      }}
      onClick={onClick}
    >
      Import
    </button>
  );
};
