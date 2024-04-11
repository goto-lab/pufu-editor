import loglevel from "loglevel";

const defaultLogLevel = "info";
loglevel.setLevel(defaultLogLevel);
export const logger = {
  ...loglevel,
  /* eslint @typescript-eslint/no-explicit-any: 0 */
  info: (...msg: any[]) => {
    loglevel.info(...msg);
  },
  error: (...msg: any[]) => {
    loglevel.error(...msg);
  },
  fatal: (...msg: any[]) => {
    loglevel.error(...msg);
  },
} as const;
