export const throwError = (msg: string) => {
  throw new Error(`[hamber-preprocess] ${msg}`);
};

export const throwTypescriptError = () => {
  throwError(`Encountered type error`);
};
