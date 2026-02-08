import { logger } from "./utils";

class Greeting {
  public sayHello(name?: string): string;
  public sayHello(name: string, age?: number): string;
  public sayHello(name?: string, age?: number): string {
    let message = "Hello";

    if (name) {
      message += ` ${name}`;
    }

    if (age) {
      message += ` ${age}`;
    }

    if (!name && !age) {
      message += " Stranger";
    }

    return message;
  }
}

const greet = new Greeting();

logger.log(greet.sayHello());
logger.log(greet.sayHello("Sam"));
logger.log(greet.sayHello("Sam", 22));
