// program to check if the string is palindrome or not

function checkPalindromeLoop(word: string = "") {
  const _word = word
    .replace(/[^a-z0-9]/g, "")
    .trim()
    .toLowerCase();
  const len = _word.length;

  if (len === 0) return false;

  // loop through half of the word
  for (let i = 0; i < len / 2; i++) {
    // check if first and last characters are different
    if (_word[i] !== _word[len - 1 - i]) {
      return false;
    }
  }

  return true;
}

// take input
const word = prompt("Enter a word: ") ?? undefined;

// call the function
const value = checkPalindromeLoop(word);

console.log(value);
