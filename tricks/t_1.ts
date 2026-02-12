/**
 * Returns a formatted string showing the student's marks.
 * If marks is 0 (or any falsy value), it shows "Absent".
 */
function showMessage(marks: number): string {
  // Using logical OR (||):
  // If marks is truthy → message = marks
  // If marks is falsy (0, null, undefined, "", false) → message = "Absent"
  // Since 0 is falsy in JavaScript, 0 becomes "Absent"
  // Recommended: marks ?? "Absent"
  const message = marks || "Absent";

  // Template literal to format the output string
  return `Marks ${message}`;
}

// Calls the function with 29 (truthy)
// So message = 29
console.log(showMessage(29)); // Marks 29

// Calls with 0 (falsy)
// So message = "Absent"
console.log(showMessage(0)); // Marks Absent

// Calls with 46 (truthy)
// So message = 46
console.log(showMessage(46)); // Marks 46
