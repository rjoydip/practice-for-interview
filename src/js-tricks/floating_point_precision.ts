// In JavaScript, numbers are floating-point (IEEE 754).
// 0.1 + 0.2 results in 0.30000000000000004, not exactly 0.3.
// Therefore, this comparison returns false.
console.log(0.3 === 0.2 + 0.1); // false
