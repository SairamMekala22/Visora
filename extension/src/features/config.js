

import { env } from '@xenova/transformers';

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

if (env.backends && env.backends.onnx) {
  env.backends.onnx.logLevel = 'error';
}

export { env };
