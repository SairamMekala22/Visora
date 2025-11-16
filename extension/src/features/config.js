

import { env } from '@xenova/transformers';

// Configure Transformers.js environment
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

// Suppress ONNX runtime warnings (they're just informational)
if (env.backends && env.backends.onnx) {
  env.backends.onnx.logLevel = 'error'; // Only show errors, not warnings
}

export { env };
