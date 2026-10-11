"use strict";

const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearButton = document.querySelector("#clear-btn");
const themeButton = document.querySelector("#theme-toggle");

const DRAFT_KEY = "plp-day4-draft";
const THEME_KEY = "plp-day4-theme";

function updateCounts() {
  const text = textarea.value;
  const characters = text.length;
  const trimmedText = text.trim();
  const words = trimmedText === ""
    ? 0
    : trimmedText.split(/\s+/).length;

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.toggle(
    "warning",
    characters > 180 && characters <= 200
  );
  charCount.classList.toggle("over", characters > 200);
}

function clearDraft() {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  textarea.focus();
}

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeButton.textContent = isDark ? "Light mode" : "Dark mode";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

textarea.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem(DRAFT_KEY, textarea.value);
});

clearButton.addEventListener("click", clearDraft);

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    clearDraft();
  }
});

themeButton.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");
  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

const savedDraft = localStorage.getItem(DRAFT_KEY);
textarea.value = savedDraft === null ? "" : savedDraft;

const savedTheme = localStorage.getItem(THEME_KEY);
applyTheme(savedTheme === "dark");

updateCounts();