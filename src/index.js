import {
  openDatabase,
  insertItem,
  updateItem,
  allItems,
  deleteAllItems,
  watchList
} from "@/database";

let inputField;
let itemList;
let clearButton;
let editing = null;

const config = {
  dbFilename: "add-powersync.sqlite",
};

document.addEventListener("DOMContentLoaded", async (event) => {
  inputField = document.getElementById("inputField");
  itemList = document.getElementById("itemList");
  clearButton = document.getElementById("clearButton");

  inputField.addEventListener("keydown", keyDown);
  itemList.addEventListener("click", itemClick);
  clearButton.addEventListener("click", clearList);

  inputField.disabled = true;
  inputField.placeholder = "Opening Database...";
  await openDatabase(config);

  watchList((rows) => {
    populateList(rows._array);
  });

  await allItems();

  inputField.placeholder = "Type something and press Enter";
  inputField.disabled = false;
});

const keyDown = async (event) => {
  if (event.key === "Enter") {
    if (!editing) {
      insertItem(inputField.value);
    } else {
      updateItem(editing.id, inputField.value);
    }
    inputField.value = "";
    editing = null;
  }
};

const itemClick = async (event) => {
  editing = event.target;
  inputField.value = editing.innerText;
  inputField.focus();
};

async function clearList() {
	inputField.value = "";
	deleteAllItems();
}

const appendItem = (row) => {
  const li = document.createElement("li");

  li.innerText = row.text;
  li.id = row.id;

  itemList.appendChild(li);
};

const populateList = (rows) => {
  itemList.innerHTML = "";

  for (const row of rows) {
    appendItem(row);
  }
};
