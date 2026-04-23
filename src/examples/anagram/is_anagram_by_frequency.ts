function isAnagramByFrequency(str1: string, str2: string): boolean {
  if (str1.length !== str2.length) {
    return false;
  }

  const charCount: { [key: string]: number } = {};

  // Count characters in the first string
  for (const char of str1) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Decrement counts for characters in the second string
  for (const char of str2) {
    if (!charCount[char]) {
      return false; // Character not in the first string
    }
    charCount[char]--;
  }

  // All counts should be zero if they are anagrams
  for (const count in charCount) {
    if (charCount[count] !== 0) {
      return false;
    }
  }

  return true;
}

// Example usage:
console.log(isAnagramByFrequency("heart", "earth")); // Output: true
console.log(isAnagramByFrequency("hello", "world")); // Output: false
