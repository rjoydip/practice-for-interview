// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*

import { logger } from "../utils";

function* increment() {
  let counter = 0;
  while (true) {
    counter++;
    yield counter;
  }
}

const inc = increment();

logger.log(inc.next());
logger.log(inc.next());
