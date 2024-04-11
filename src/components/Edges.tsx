import { useState, useLayoutEffect, useRef } from "react";
import short from "short-uuid";
import { ProjectScoreMap } from "../lib/models";
export interface EdgesProps {
  scoreKey: string;
  scores: ProjectScoreMap;
  action: boolean;
  preview: boolean;
}

interface Position {
  x: number;
  y: number;
}
interface PostionSet {
  left: Position;
  right: Position;
  dashed: boolean;
}

const userAgent = window.navigator.userAgent.toLowerCase();
const isSafari =
  !(userAgent.indexOf("chrome") != -1) && userAgent.indexOf("safari") != -1;

export const Edges = ({
  scoreKey,
  scores,
  action,
  preview = false,
}: EdgesProps) => {
  const [viewBox, setViewBox] = useState("0 0 0 0");
  const [edges, setEdges] = useState<PostionSet[]>([]);
  const ref = useRef<SVGSVGElement | null>(null);

  useLayoutEffect(() => {
    updateEdges();
    const observer = new ResizeObserver((entries) => {
      entries.forEach(() => {
        updateEdges();
      });
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    // ResizeObserver is not working at Safari 16.6
    if (isSafari) {
      window.addEventListener("resize", updateEdges);
    }
    return () => {
      observer.disconnect();
      if (isSafari) {
        window.removeEventListener("resize", updateEdges);
      }
    };
  }, [scores, action]);

  const updateEdges = () => {
    const dom = document.getElementById(`score-${scoreKey}`);
    if (dom) {
      const rect = dom.getBoundingClientRect();
      const height = rect.height;
      const width = rect.width;
      const baseX = rect.left;
      const baseY = rect.top;
      setViewBox(`0 0 ${width} ${height}`);
      if (scoreKey in scores) {
        setEdges(getEdgePositions(scoreKey, scores, baseX, baseY));
      }
    }
  };

  const getEdgePositions = (
    scoreKey: string,
    scores: ProjectScoreMap,
    baseX: number,
    baseY: number
  ): PostionSet[] => {
    const score = scores[scoreKey];
    const edges = score.map.purposes.map((p) => {
      return [
        `${scoreKey}-purpose-${p.uuid}`,
        `${scoreKey}-win-condition-${score.map.winCondition.uuid}`,
        "win-condition",
        "line",
      ];
    });
    const measureTexts: string[] = [];
    interface purposeMap {
      measure: string;
      purpose: string;
    }
    const purposeMapping: purposeMap[] = [];
    if (score.map.purposes.length > 0) {
      score.map.purposes.forEach((purpose) => {
        purpose.measures.forEach((measure) => {
          if (measure.text && measureTexts.includes(measure.text)) {
            edges.push([
              `${scoreKey}-measure-${measure.uuid}`,
              `${scoreKey}-purpose-${purpose.uuid}`,
              "",
              "dashed",
            ]);
            const index = measureTexts.indexOf(measure.text);
            if (purpose.uuid !== purposeMapping[index].purpose)
              edges.push([
                `${scoreKey}-measure-${purposeMapping[index].measure}`,
                `${scoreKey}-purpose-${purpose.uuid}`,
                "",
                "line",
              ]);
          } else {
            edges.push([
              `${scoreKey}-measure-${measure.uuid}`,
              `${scoreKey}-purpose-${purpose.uuid}`,
              "",
              "line",
            ]);
          }
          purposeMapping.push({ measure: measure.uuid, purpose: purpose.uuid });
          measureTexts.push(measure.text);
        });
      });
    }

    return edges.map((edge) => {
      const start = document.getElementById(edge[0]);
      const end = document.getElementById(edge[1]);
      const point = {
        left: getRightPosition(start!, baseX, baseY),
        right: getLeftPosition(end!, baseX, baseY),
        dashed: edge[3] === "dashed",
      };
      if (edge[2] === "win-condition") {
        point.right.x -= 1;
        point.right.y -= isSafari ? (preview ? 10 : 1) : preview ? 16 : 3;
      } else {
        point.left.x += 1;
        point.left.y -= isSafari ? (preview ? 5 : -1) : preview ? 2 : 1;
      }
      return point;
    });
  };
  const getRightPosition = (
    element: HTMLElement,
    baseX: number,
    baseY: number
  ) => {
    if (element) {
      const position = element.getBoundingClientRect();
      return {
        x: position.left - baseX + position.width - 1,
        y: position.top - baseY + position.height / 2,
      };
    } else {
      return {
        x: -1,
        y: -1,
      };
    }
  };

  const getLeftPosition = (
    element: HTMLElement,
    baseX: number,
    baseY: number
  ) => {
    if (element) {
      const position = element.getBoundingClientRect();
      return {
        x: position.left - baseX + 1,
        y: position.top - baseY + position.height / 2,
      };
    } else {
      return {
        x: -1,
        y: -1,
      };
    }
  };

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0"
      viewBox={viewBox}
      width="100%"
      height="100%"
      ref={ref}
    >
      {edges.map((e) => {
        return (
          <line
            key={short.generate()}
            x1={e.left.x}
            y1={e.left.y}
            x2={e.right.x}
            y2={e.right.y}
            stroke="#888"
            strokeWidth="1"
            strokeDasharray={`${e.dashed ? "2" : "0"}`}
            visibility={preview && e.dashed ? "hidden" : "visible"}
          ></line>
        );
      })}
    </svg>
  );
};
