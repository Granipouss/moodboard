export const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(() => resolve(), ms));

export const clamp = (
  num: number,
  [min, max]: readonly [number, number],
): number => (num <= min ? min : num >= max ? max : num);
