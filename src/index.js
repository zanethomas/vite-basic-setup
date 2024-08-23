import {
  openDatabase,
  insertItem,
  updateItem,
  allItems,
  deleteAllItems,
} from "@/database";
import { SupabaseConnector } from "@/connectors/supabase";

let inputField;
let itemList;
let clearButton;
let editing = "";

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
  await allItems().then((rows) => {
    console.log("rows", rows);
    populateList(rows);
    inputField.placeholder = "Type something and press Enter";
    inputField.disabled = false;
  });
});

const keyDown = async (event) => {
  if (event.key === "Enter") {
    if (!editing) {
      const result = await insertItem(inputField.value);

      appendItem(result.rows.item(0));
      // appendItem(result.data[0]);
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
  const li = document.createElement("li");

  li.innerText = row.text;
  li.id = row.id;

  itemList.appendChild(li);
};

const populateList = (rows) => {
  for (const row of rows) {
    appendItem(row);
  }
};
