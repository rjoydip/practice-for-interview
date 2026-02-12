export const reverseAndCapitalize = (sentence: string): string => {
  return sentence
    .split(" ")
    .reverse()
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// -----------------------------------------------

// Example usage:
const result = reverseAndCapitalize("hello world from typescript");
console.log(result); // "Typescript From World Hello"

export const reverseAndCapitalizeWithReduce = (sentence: string): string => {
  return sentence
    .split(" ")
    .reduce((acc: string[], word: string) => {
      const capitalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      // biome-ignore lint/performance/noAccumulatingSpread: Intentionally
      return [capitalized, ...acc];
    }, [])
    .join(" ");
};

// Example usage:
const resultReduce = reverseAndCapitalizeWithReduce("hello world from typescript");
console.log(resultReduce); // "Typescript From World Hello"
