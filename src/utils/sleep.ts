import { fromSafePromise } from "neverthrow";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const safeSleep = (ms: number) => fromSafePromise<void>(sleep(ms));
