import { describe, expect, test } from "bun:test";
import { JsonParseError } from "../errors";
import { parseJson } from "./json";

describe("parseJson", () => {
  test("parses a valid JSON object", () => {
    const result = parseJson<{ foo: string }>('{"foo":"bar"}');
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({ foo: "bar" });
  });

  test("parses a valid JSON array", () => {
    const result = parseJson<number[]>("[1,2,3]");
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual([1, 2, 3]);
  });

  test("returns an Err for invalid JSON", () => {
    const result = parseJson("not json");
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(JsonParseError);
  });

  test("error carries the original invalid JSON string", () => {
    const result = parseJson("{bad json}");
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(JsonParseError);
  });
});
