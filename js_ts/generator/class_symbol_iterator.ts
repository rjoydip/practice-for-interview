import { logger } from "../utils";

class Foo {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
}

logger.log(Array.from(new Foo()));
