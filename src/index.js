let inputField;
let itemList;
let clearButton;
let editing = null;

document.addEventListener("DOMContentLoaded", (event) => {
  inputField = document.getElementById("inputField");
  itemList = document.getElementById("itemList");
  clearButton = document.getElementById("clearButton");

  inputField.addEventListener("keydown", keyDown);
  itemList.addEventListener("click", itemClick);
  clearButton.addEventListener("click", clearList);
});

const keyDown = async (event) => {
  if (event.key === "Enter") {
    if (!editing) {
      appendItem(inputField.value);
    } else {
      editing.innerText = inputField.value;
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
  itemList.innerHTML = "";
  inputField.value = "";
  inputField.focus();
}

const appendItem = (text) => {
  const item = document.createElement("li");

  item.innerText = text;
  itemList.appendChild(item);
};