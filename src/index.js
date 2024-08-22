import {
  openDatabase,
  insertItem,
  updateItem,
  allItems,
  deleteAllItems,
} from "@/database";
import { DummyConnector } from "@/connectors/dummy";

let inputField;
let itemList;
let clearButton;
let editing = "";

const config = {
  connector: DummyConnector,
  dbFilename: "add-powersync.sqlite",
};

document.addEventListener("DOMContentLoaded", async (event) => {
  inputField = document.getElementById("inputField");
  itemList = document.getElementById("itemList");
  clearButton = document.getElementById("clearButton");

  inputField.addEventListener("keydown", keyDown);
  itemList.addEventListener("click", itemClick);
  clearButton.addEventListener("click", clearList);

  await openDatabase(config);

  await allItems().then((rows) => {
    populateList(rows);
    inputField.placeholder = "Type something and press Enter";
  });
});

const keyDown = async (event) => {
  if (event.key === "Enter") {
    if (!editing) {
      appendItem(inputField.value, await insertItem(inputField.value));
    } else {
      editing.innerText = inputField.value;
      updateItem(editing.id, inputField.value);
    }
    inputField.value = "";
    editing = "";
  }
};

const itemClick = async (event) => {
  editing = event.target;
  inputField.value = editing.innerText;
  inputField.focus();
};

async function clearList() {
  deleteAllItems();
  itemList.innerHTML = "";
}

const appendItem = (row) => {
<<<<<<< HEAD
=======
	console.log('row', row)
>>>>>>> db5b088 (added functionality)
  const li = document.createElement("li");

  li.innerText = row.item;
  li.id = row.id;

  itemList.appendChild(li);
};

const populateList = (rows) => {
  for (const row of rows) {
    appendItem(row);
  }
};
