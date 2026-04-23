function* logGenerator(): Generator<void, void, string> {
  console.log(0);
  console.log(1, yield);
  console.log(2, yield);
}

const gen = logGenerator();

// The first call of next executes from the start of the function until the first yield statement
gen.next(); // 0
gen.next("Hello"); // 1 Hello
gen.next("Hello 1"); // 2 Hello 1
gen.next("Complete"); // Nothing will show in terminal
