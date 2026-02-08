// The void operator evaluates the given expression and then returns undefined.

import { logger } from "../utils";

// `void 1` evaluates to undefined.
const output = void 1;
logger.log(output); // logs: undefined

try {
  // Using `void` with a named function declaration forces it to be treated as a function expression.
  // However, the function name `test_fn` is only available within the function's scope, not the outer scope.
  void function test_fn() {
    logger.log("test function executed");
  };

  // This will throw a ReferenceError because test_fn is not defined in this scope.
  // @ts-expect-error
  test_fn();
} catch (e) {
  // The catch block will be executed.
  logger.error("test function is not defined", e); // logs: test function is not defined
}

// A common historical use of `void` was to create an Immediately Invoked Function Expression (IIFE).
// The `void` operator ensures the function is treated as an expression.
void (function iife() {
  logger.log("iife is executed"); // logs: iife is executed
})();

// The void operator can be used to evaluate an expression while returning undefined.
// `logger.log` is executed, and its return value (which is undefined) is consumed by `void`.
void logger.log("expression evaluated"); // logs: expression evaluated
