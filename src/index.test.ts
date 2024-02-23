import { tokenizeAndEstimateCost, estimateCost } from "./index";
import { describe, it, expect } from "vitest";

describe("tokenizeAndEstimateCost", () => {
  it("should tokenize and estimate cost correctly", async () => {
    expect(
      await tokenizeAndEstimateCost({
        model: "gpt-4-0125-preview",
        input: "Hello, world!",
        output: "Hi there, how are you?",
      })
    ).toEqual({
      inputTokens: 4,
      outputTokens: 7,
      cost: 0.00025,
    });
  });
});

describe("estimateCost", () => {
  it("should estimate cost correctly", () => {
    expect(
      estimateCost({
        model: "gpt-4-0125-preview",
        inputTokens: 3000,
        outputTokens: 2100,
      })
    ).toBe(0.093);
  });

  it("should estimate cost correctly for embeddings model", () => {
    expect(
      estimateCost({
        model: "text-embedding-ada-002",
        inputTokens: 3000,
      })
    ).toBe(0.0003);
  });
});
