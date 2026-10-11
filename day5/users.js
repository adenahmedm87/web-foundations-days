"use strict";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let users = [];
let hasLoaded = false;
let isLoading = false;

function renderUsers(list) {
  usersList.replaceChildren();

  list.forEach(user => {
    const item = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    item.append(name, email, city, company);
    usersList.appendChild(item);
  });
}

function applyFilter() {
  const search = filterInput.value.trim().toLowerCase();

  const matches = users.filter(user =>
    user.name.toLowerCase().includes(search)
  );

  renderUsers(matches);

  if (matches.length === 0) {
    statusText.textContent = "No users match your filter.";
  } else if (search === "") {
    statusText.textContent = `Loaded ${users.length} users.`;
  } else {
    statusText.textContent =
      `Showing ${matches.length} of ${users.length} users.`;
  }
}

async function loadUsers() {
  if (isLoading) return;

  isLoading = true;
  loadButton.disabled = true;
  filterInput.disabled = true;
  statusText.textContent = "Loading users...";
  usersList.replaceChildren();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("The server returned an unexpected response.");
    }

    users = data;
    hasLoaded = true;
    applyFilter();
  } catch (error) {
    users = [];
    hasLoaded = false;
    renderUsers(users);
    statusText.textContent =
      "Could not load users. Please try again.";
    console.error("Loading users failed:", error);
  } finally {
    isLoading = false;
    loadButton.disabled = false;
    filterInput.disabled = false;
  }
}

loadButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", () => {
  if (hasLoaded && !isLoading) {
    applyFilter();
  }
});