function isAnagram(str1: string, str2: string) {
  // Helper function to clean and sort a string
  const normalizeAndSort = (str: string) => {
    return str
      .replace(/[^\w]/g, "") // Remove non-alphanumeric characters
      .toLowerCase() // Convert to lowercase for case-insensitivity
      .split("") // Split into an array of characters
      .sort() // Sort the array alphabetically
      .join(""); // Join the array back into a string
  };

  const sortedStr1 = normalizeAndSort(str1);
  const sortedStr2 = normalizeAndSort(str2);

  // If the sorted strings are equal, they are anagrams
  return sortedStr1 === sortedStr2;
}

// Example usage:
console.log(isAnagram("listen", "silent")); // Output: true
console.log(isAnagram("A gentleman", "elegant man")); // Output: true
console.log(isAnagram("rat", "car")); // Output: false
console.log(isAnagram("Listen", "Silent")); // true
console.log(isAnagram("Astronomer", "Moon starer")); // true
console.log(isAnagram("Hello", "Olelh!")); // true
