// Explores the execution order of different Node.js event loop phases.
// `process.nextTick` callbacks are executed first, before the event loop proceeds.
// The order between `setTimeout(..., 0)` and `setImmediate(...)` can be unpredictable
// when run in the main module, as it depends on process performance. However,
// `setImmediate` is generally favored for executing code after I/O events.
// Expected output will always start with "tick", followed by "timeout 0" and "imediate"
// in a non-deterministic order.

import { logger } from "../utils";

// Timing
setTimeout(() => logger.log("timeout 0"), 0);
process.nextTick(() => logger.log("tick"));
setImmediate(() => logger.log("imediate"));
