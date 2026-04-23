const a = new Set([1, 2, 3]);
const b = new Map([
  [1, "one"],
  [2, "two"],
  [4, "four"],
]);

console.log(a.union(b)); // Set(4) {1, 2, 3, 4}
