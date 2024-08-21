// This is the main entry point of the application
let inputField;
let itemList;
let clearButton;
let editing = "";

document.addEventListener("DOMContentLoaded", (event) => {
  inputField = document.getElementById("inputField");
  itemList = document.getElementById("itemList");
  clearButton = document.getElementById("clearButton");

  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (!editing) {
        appendItem(inputField.value);
        inputField.value = "";
      } else {
		  editing.innerText = inputField.value;
		  editing = "";
		  inputField.value = "";
		  inputField.focus();
		}
    }
  });
  itemList.addEventListener("click", itemClick);
  clearButton.addEventListener("click", (event) => {
    itemList.innerHTML = "";
  });
});

const itemClick = async (event) => {
  editing = event.target;
  inputField.value = editing.innerText;
  editing.focus();
};

async function clearList() {
  itemList.innerHTML = "";
}

const appendItem = (text) => {
  const item = document.createElement("li");

  item.innerText = text;
  itemList.appendChild(item);
};
