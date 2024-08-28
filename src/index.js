import {
  loginAnon,
  openDatabase,
  insertItem,
  updateItem,
  allItems,
  deleteAllItems,
  watchList,
} from "@/database";
import { SupabaseConnector } from "@/supabase";

let inputField;
let itemList;
let clearButton;
let editing = null;

const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  powersyncUrl: import.meta.env.VITE_POWERSYNC_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  connector: SupabaseConnector,
  filename: "add-supabase.sqlite",
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
  await loginAnon();

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
  deleteAllItems();
  inputField.value = "";
  inputField.focus();
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
