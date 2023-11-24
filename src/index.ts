import { Tiktoken } from "tiktoken/lite";
import { load } from "tiktoken/load";
import registry from "tiktoken/registry.json";
import models from "tiktoken/model_to_encoding.json";
import modelPrices from "../model_prices_and_context_window.json";

const cachedModel: Record<
  string,
  {
    model: {
      explicit_n_vocab: number | undefined;
      pat_str: string;
      special_tokens: Record<string, number>;
      bpe_ranks: string;
    };
    encoder: Tiktoken;
  }
> = {};

const initTikToken = async (modelName: string) => {
  if (!cachedModel[modelName]) {
    const fallback = "gpt-3.5-turbo";
    const gptModelName = modelName in models ? modelName : fallback;
    if (modelName in models) {
      console.info(`Initializing ${modelName} tokenizer`);
    } else {
      console.info(
        `Tokenizer for ${modelName} not defined, falling back to ${fallback} tokenizer. If you want to contribute a tokenizer for ${modelName}, please open an issue at https://github.com/rogeriochaves/llm-cost/issues/new`
      );
    }
    const registryInfo = (registry as any)[(models as any)[gptModelName]];
    const model = await load(registryInfo);
    const encoder = new Tiktoken(
      model.bpe_ranks,
      model.special_tokens,
      model.pat_str
    );

    cachedModel[modelName] = { model, encoder };
  }

  return cachedModel[modelName];
};

async function countTokens(model: string, text: string) {
  if (!text) return 0;

  const { encoder } = await initTikToken(model);

  return encoder.encode(text).length;
}

export async function tokenizeAndEstimateCost({
  model,
  input,
  output,
}: {
  model: string;
  input?: string;
  output?: string;
}): Promise<{
  inputTokens: number;
  outputTokens: number;
  cost: number | undefined;
}> {
  const inputTokens = (input && (await countTokens(model, input))) || 0;
  const outputTokens = (output && (await countTokens(model, output))) || 0;

  const cost = estimateCost({ model, inputTokens, outputTokens });

  return {
    inputTokens,
    outputTokens,
    cost,
  };
}

export function estimateCost({
  model,
  inputTokens,
  outputTokens,
}: {
  model: string;
  inputTokens?: number;
  outputTokens?: number;
}): number | undefined {
  const modelPrice = (
    modelPrices as Record<
      string,
      { input_cost_per_token: number; output_cost_per_token: number }
    >
  )[model];

  return modelPrice
    ? (inputTokens || 0) * modelPrice.input_cost_per_token +
        (outputTokens || 0) * modelPrice.output_cost_per_token
    : undefined;
}
