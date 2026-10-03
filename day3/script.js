// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search without case sensitivity
function searchNotes(word) {
  return notes.filter((note) =>
    note.text.toLowerCase().includes(word.toLowerCase())
  );
}

// 2. Find the longest note
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (const note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }

  return longest;
}

// 3. Count notes in each category
function countByCategory() {
  const counts = {};

  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }

  return counts;
}

// 4. Build a summary
function getSummary() {
  const counts = countByCategory();
  const noteWord = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

// 5. Check duplicates, ignoring case and extra spaces
function isDuplicate(text) {
  const cleaned = text.trim().replace(/\s+/g, " ").toLowerCase();

  return notes.some((note) =>
    note.text.trim().replace(/\s+/g, " ").toLowerCase() === cleaned
  );
}

// 6. Add a valid, unique note
function addNote(text, category) {
  if (typeof text !== "string") {
    console.log("Rejected: note text must be a string.");
    return false;
  }

  const cleaned = text.trim();

  if (cleaned.length < 1 || cleaned.length > 200) {
    console.log("Rejected: note must contain 1–200 characters.");
    return false;
  }

  if (!["personal", "work", "study"].includes(category)) {
    console.log("Rejected: category must be personal, work or study.");
    return false;
  }

  if (isDuplicate(cleaned)) {
    console.log("Rejected: this note already exists.");
    return false;
  }

  let nextId = 1;

  for (const note of notes) {
    if (note.id >= nextId) {
      nextId = note.id + 1;
    }
  }

  notes.push({
    id: nextId,
    text: cleaned,
    category: category,
  });

  console.log(`Added: "${cleaned}" (${category}).`);
  return true;
}

// TESTS: normal cases using the starting data
console.log("SEARCH:", searchNotes("MILK"));
// Expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

console.log("SEARCH NO MATCH:", searchNotes("elephant"));
// Expected: []

console.log("LONGEST:", longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

console.log("CATEGORY COUNTS:", countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

console.log("SUMMARY:", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

console.log("DUPLICATE:", isDuplicate("  BUY   MILK AND BREAD  "));
// Expected: true

console.log("NOT DUPLICATE:", isDuplicate("Read a new book"));
// Expected: false

// TESTS: empty notes array
const startingNotes = notes;
notes = [];

console.log("EMPTY LONGEST:", longestNote());
// Expected: null

console.log("EMPTY CATEGORY COUNTS:", countByCategory());
// Expected: {}

console.log("EMPTY SUMMARY:", getSummary());
// Expected: "0 notes: 0 personal, 0 work, 0 study."

// TEST: singular wording
notes = [
  { id: 1, text: "Read a book", category: "personal" },
];

console.log("SINGLE SUMMARY:", getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."

// Restore the starting data
notes = startingNotes;

// TESTS: adding and rejecting notes
console.log("VALID ADD:", addNote("Learn JavaScript functions", "study"));
// Expected: true; logs the added note.

console.log("EMPTY ADD:", addNote("   ", "personal"));
// Expected: false; logs the length rejection.

console.log("DUPLICATE ADD:", addNote("  buy milk and bread  ", "personal"));
// Expected: false; logs the duplicate rejection.

console.log("INVALID CATEGORY:", addNote("Plan a meeting", "other"));
// Expected: false; logs the category rejection.

console.log("TOO LONG:", addNote("a".repeat(201), "work"));
// Expected: false; logs the length rejection.

console.log("200 CHARACTERS:", addNote("a".repeat(200), "work"));
// Expected: true; logs the added note.

// Remove test additions so the toolkit starts with its original five notes
notes = notes.filter((note) => note.id <= 5);

console.log("FINAL SUMMARY:", getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."