/**
 * Finds the length of the longest substring without repeating characters.
 * This is a common algorithm problem often solved with a "sliding window" approach.
 * @params The input string.
 * @returns The length of the longest substring.
 */
function lengthOfLongestSubstring(s: string): number {
  // Stores the last seen index of each character.
  const charIndexMap = new Map<string, number>();
  let maxLength = 0;
  // 'left' is the starting index of the current window.
  let left = 0;

  // 'right' is the ending index of the current window, which expands as we loop.
  for (let right = 0; right < s.length; right++) {
    const currentChar = s[right];

    if (currentChar) {
      // Check if the current character is already in our window.
      // If it is, and its last seen position is at or after our window's start,
      // we have a repeating character.
      if (charIndexMap.has(currentChar) && charIndexMap.get(currentChar)! >= left) {
        // Move the left side of the window to the position right after
        // the last occurrence of the repeating character.
        left = charIndexMap.get(currentChar)! + 1;
      }

      // Update the map with the current character's latest position.
      charIndexMap.set(currentChar, right);

      // Calculate the length of the current valid window.
      const currentLength = right - left + 1;

      // Update the maximum length found so far.
      maxLength = Math.max(maxLength, currentLength);
    }
  }

  return maxLength;
}

// Example Usage:
console.log(`"abcabcbb" → ${lengthOfLongestSubstring("abcabcbb")}`); // Expected: 3
console.log(`"bbbbb" → ${lengthOfLongestSubstring("bbbbb")}`); // Expected: 1
console.log(`"pwwkew" → ${lengthOfLongestSubstring("pwwkew")}`); // Expected: 3
console.log(`"" → ${lengthOfLongestSubstring("")}`); // Expected: 0
console.log(`"dvdf" → ${lengthOfLongestSubstring("dvdf")}`); // Expected: 3
