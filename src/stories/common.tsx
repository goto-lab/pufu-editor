import React from "react";
import { ProjectScoreModel } from "../lib/models";
import { downloadScore } from "../components/ProjectScore";

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

export type DownloadButtonProps = {
  scoreKey: string;
  kind: "json" | "png" | "svg";
};

export const DownloadButton = ({ scoreKey, kind }: DownloadButtonProps) => {
  return (
    <button
      style={{
        margin: "10px",
        padding: "4px 8px",
        color: "#fff",
        backgroundColor: "#168dff",
        borderRadius: "6px",
      }}
      onClick={() => {
        downloadScore(scoreKey, kind);
      }}
    >
      Download ({kind})
    </button>
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

export type LocalSaveProps = {
  checked: boolean;
  onClick: (checked: boolean) => void;
  onLoad: () => void;
  onSave: () => void;
};
export const LocalSave = ({
  checked,
  onClick,
  onLoad,
  onSave,
}: LocalSaveProps) => {
  const [saving, setSaving] = React.useState(false);
  const handleCheckboxChange = (event) => {
    onClick(event.target.checked);
  };
  const handleSave = () => {
    setSaving(true);
    onSave();
    setTimeout(() => {
      setSaving(false);
    }, 500);
  };
  return (
    <div>
      <div className="inline-flex content-center items-center">
        <button
          style={{
            margin: "10px 5px 10px 10px",
            padding: "4px 8px",
            color: "#fff",
            backgroundColor: checked ? "#168dff" : "#aaa",
            borderRadius: "6px",
          }}
          onClick={onLoad}
        >
          Load
        </button>
        <button
          style={{
            margin: "10px",
            padding: "4px 8px",
            color: "#fff",
            backgroundColor: checked ? "#168dff" : "#aaa",
            borderRadius: "6px",
          }}
          onClick={handleSave}
        >
          {saving ? (
            <div className="flex justify-center p-1" aria-label="saving">
              <div className="animate-spin h-4 w-4 border-4 border-blue-300 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            "Save"
          )}
        </button>
        <label className="flex content-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={handleCheckboxChange}
          />
          <div
            className="
            relative w-11 h-6 bg-gray-200
            peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800
            rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
            after:start-[2px] after:bg-white after:border-gray-300 after:border
            after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600
          "
          ></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Local save
          </span>
        </label>
      </div>
    </div>
  );
};

export const exampleData: ProjectScoreModel = {
  winCondition: {
    uuid: "er2ugQkdnw5WY2ceSGqVNV",
    text: "人を惹きつけるようなオープンな開発をプ譜で体現する",
    comment: {
      color: "blue",
      text: "",
    },
  },
  gainingGoal: {
    uuid: "2MfGeLrm8PQaaVe3v3ABsV",
    text: "プ譜や統合的な視点での考え方を開発者らしいやり方で伝え、よりよい社会づくりに繋げたい。",
    comment: {
      color: "blue",
      text: "",
    },
  },
  purposes: [
    {
      uuid: "9fov1Hdokf2NgsPkWgHatH",
      text: "オープンな開発に挑戦する",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [
        {
          uuid: "dNmKUssH2tNG9k5cdato5a",
          text: "OSSとしてコードを公開する",
          comment: {
            color: "blue",
            text: "",
          },
          color: "red",
        },
        {
          uuid: "aUTXd41VA9FqT36QPDWhRW",
          text: "OSSを開発する人たちと出会う",
          comment: {
            color: "blue",
            text: "",
          },
          color: "white",
        },
        {
          uuid: "aUTXd41VA9FqT36QPDWhRA",
          text: "OSSのイベントに参加する",
          comment: {
            color: "blue",
            text: "",
          },
          color: "white",
        },
      ],
    },
    {
      uuid: "6dVHgBSKhKWrrnA7DP8pYJ",
      text: "キックプ譜をより\n使いやすくする",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [
        {
          uuid: "cPUE9CEA4XqVKmRCP5LWdB",
          text: "キックプ譜を開発する中で感じた機能的課題を解消する",
          comment: {
            color: "blue",
            text: "",
          },
          color: "white",
        },
        {
          uuid: "vhKMTEwnoN3CZLmVYfDqHB",
          text: "次局面の作成をしたくなるようなデザインを取り入れる",
          comment: {
            color: "blue",
            text: "",
          },
          color: "white",
        },
        {
          uuid: "9ChYdz6X8JrfdA6EZmcJNb",
          text: "プ譜の共有を通してプロジェクトに取り組む人たちを繋げ、その人達を活気づける",
          comment: {
            color: "blue",
            text: "",
          },
          color: "white",
        },
      ],
    },
    {
      uuid: "bUSgSNsqhbe7J3tRx9YphR",
      text: "気軽にプ譜をさわれる\nデモ環境をつくる",
      comment: {
        color: "blue",
        text: "",
      },
      measures: [
        {
          uuid: "1FfnMYiJ9oXeSvARDLFp6B",
          text: "ログイン不要のデモ環境を用意する",
          comment: {
            color: "blue",
            text: "",
          },
          color: "white",
        },
      ],
    },
  ],
  elements: {
    people: {
      uuid: "dSBEkjE97WJKusXj4mX3o9",
      text: "・新しい取り組むを始めたい人\n・プロジェクトに関わる人\n・プ譜の考案者＆著者\n・プ譜エディタの開発者",
      comment: {
        color: "blue",
        text: "",
      },
    },
    money: {
      uuid: "3riARy1KMx37SVDqia834e",
      text: "無駄にお金を掛けない。掛けるべきところに掛ける。",
      comment: {
        color: "blue",
        text: "",
      },
    },
    time: {
      uuid: "gv27PgCn4cfknyJfD9LmuH",
      text: "限られた時間ではあるが惜しまない",
      comment: {
        color: "blue",
        text: "",
      },
    },
    quality: {
      uuid: "3aYHtKs1XCXJbCxRwHTV4M",
      text: "作り込みたいところを作り込む",
      comment: {
        color: "blue",
        text: "",
      },
    },
    businessScheme: {
      uuid: "1dfQPFG8icArT1tPnq3Ybn",
      text: "健全な形で見つかるとよい",
      comment: {
        color: "blue",
        text: "",
      },
    },
    environment: {
      uuid: "4X4FuZozxqPMmKLLXLBvzJ",
      text: "OSSに支えられたOSS活動",
      comment: {
        color: "blue",
        text: "",
      },
    },
    rival: {
      uuid: "vXgTh4JMQQorRiXyFCvN7o",
      text: "今はいない。出てくるとよい。",
      comment: {
        color: "blue",
        text: "",
      },
    },
    foreignEnemy: {
      uuid: "cZH7wrekSzRD2R2vaYazHj",
      text: "自分自身の中にある怠惰な心",
      comment: {
        color: "blue",
        text: "",
      },
    },
  },
};
