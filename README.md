# llm-cost

[![Tests](https://github.com/rogeriochaves/llm-cost/actions/workflows/node.js.yml/badge.svg)](https://github.com/rogeriochaves/llm-cost/actions/workflows/node.js.yml)
[![npm version](https://badge.fury.io/js/llm-cost.svg)](https://www.npmjs.com/package/llm-cost)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/rogeriochaves/llm-cost/blob/master/LICENSE)

`llm-cost` is a utility library for counting tokens and estimating the cost of LLMs from various providers such as OpenAI, Anthropic, Cohere, and more.

## Features

- **Token Counting**: Accurately count the number of tokens for a given input or output text.
- **Cost Estimation**: Estimate the cost of using an LLM based on the token count and the specific model's pricing.

## Installation

```bash
npm install llm-cost
```

## Usage

### `tokenizeAndEstimateCost`

This function takes the model name, input text, and output text. It returns a promise that resolves to an object with the number of input tokens, output tokens, and the estimated cost.
Please note that when calling `tokenizeAndEstimateCost` for the first time with a specific model, it will load the tokenizer for that model and cache it in memory. This means that the first call may be slower, but subsequent calls will be faster due to the tokenizer being cached.

```typescript
import { tokenizeAndEstimateCost } from "llm-cost";

async function main() {
  const result = await tokenizeAndEstimateCost({
    model: "gpt-4",
    input: "Hello, world!",
    output: "Hi there, how are you?",
  });

  console.log(result);
  // Output: { inputTokens: 4, outputTokens: 7, cost: 0.00054 }
}

main();
```

### `estimateCost`

This function estimates the cost of using an LLM based on the number of input and output tokens, if you already have them. It takes an object with the model name, input token count, and output token count, returning the estimated cost.

```typescript
import { estimateCost } from "llm-cost";

const cost = estimateCost({
  model: "gpt-4",
  inputTokens: 3000,
  outputTokens: 2100,
});

console.log(cost);
// Output: 0.216
```

## Contributing

We are actively seeking contributions to expand the tokenizer support for various LLM providers. Currently, the library supports tokenizers for OpenAI models. If you have expertise in other LLMs tokenizers please submit a pull-request!

For any bugs or suggestions to the library, please open an issue at [llm-cost issues](https://github.com/rogeriochaves/llm-cost/issues/new).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
