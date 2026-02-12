// 1. Synchronous code runs first
console.log("start");

// 2. process.nextTick callbacks run immediately after the current operation completes,
// before the event loop continues and before Promise microtasks.
process.nextTick(() => {
  console.log("nextTick");
});

// 3. Promise callbacks are microtasks, running after nextTick queue is empty.
Promise.resolve().then(() => {
  console.log("promise");
});

// 4. setTimeout is a macrotask (Timers phase).
// Note: In the main module, the order between setTimeout(0) and setImmediate is not guaranteed.
setTimeout(() => {
  console.log("setTimeout 0");
}, 0);

setTimeout(() => {
  console.log("setTimeout 1000");
}, 1000);

// 5. setImmediate is a macrotask (Check phase), running after the Poll phase.
setImmediate(() => {
  console.log("setImmediate");
});

// 1. Synchronous code runs first
console.log("end");

// Expected Output Order:
// start
// end
// nextTick
// promise
// setTimeout 0
// setImmediate
// setTimeout 1000
