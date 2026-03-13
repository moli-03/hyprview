export const TERMINAL_CHAR_ASPECT_RATIO = 1.7;

/** Corrects a row count for the terminal character aspect ratio, so that rows visually match columns in scale. */
export const correctRowAspect = (rows: number): number => {
  const correctedRows = rows / TERMINAL_CHAR_ASPECT_RATIO;
  return Math.floor(correctedRows);
};
