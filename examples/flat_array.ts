function deepFlatten(arr: any[]): any[] {
  return arr.reduce((acc: any[], val: any) => {
    return acc.concat(Array.isArray(val) ? deepFlatten(val) : val);
  }, []);
}

// Example Usage:
const nestedArrayReduce = [1, [2, 3], [4, [5, 6]], 7];
const flattenedReduce = deepFlatten(nestedArrayReduce);

console.log(flattenedReduce);
// Output: [1, 2, 3, 4, 5, 6, 7]
