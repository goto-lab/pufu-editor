import { useRef, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createProjectScoreStore, createInitialScoreData } from "./store";
import { ProjectScoreModel, SupportLanguage, TextSize } from "./models";

export const useClickEffect = (
  insideCallback: () => void,
  outsideCallback: () => void
) => {
  const insideRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = insideRef.current;
    if (!el) return;
    const hundleClickOutside = (e: MouseEvent) => {
      if (!el?.contains(e.target as Node)) {
        outsideCallback();
      } else {
        insideCallback();
      }
    };
    document.addEventListener("click", hundleClickOutside);
    return () => {
      document.removeEventListener("click", hundleClickOutside);
    };
  }, [insideRef]);
  return insideRef;
};

export const useProjectScoreStoreEffect = (
  key: string,
  callback: () => void,
  initScore?: ProjectScoreModel
) => {
  const store = createProjectScoreStore();
  useEffect(() => {
    store.setScore(key, initScore ?? createInitialScoreData());
    callback();
    return () => {};
  }, [initScore]);
  return store;
};

export const useI18Translation = (lang: SupportLanguage) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);
  return { i18n };
};

export const useTextSize = (textSize: TextSize) => {
  return useMemo(() => {
    switch (textSize) {
      case "small":
        return "text-sm";
      case "base":
        return "text-base leading-relaxed";
      case "large":
        return "text-lg leading-relaxed";
      default:
        return "text-sm";
    }
  }, [textSize]);
};
