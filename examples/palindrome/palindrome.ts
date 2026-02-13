function isPalindrome(word: string) {
  // Convert to lowercase and remove non-alphanumeric characters
  const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Reverse the cleaned word
  const reversedWord = cleanWord.split("").reverse().join("");

  // Compare the cleaned word with its reversed version
  return cleanWord === reversedWord;
}

// Examples:
console.log(isPalindrome("madam")); // true
console.log(isPalindrome("race car")); // true
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
