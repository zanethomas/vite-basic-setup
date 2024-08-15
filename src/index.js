// This is the main entry point of the application
let inputField;
let itemList;

window.onload = function () {
  inputField = document.getElementById("inputField");
  itemList = document.getElementById("itemList");

  inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed");
      const item = document.createElement("li");
      item.innerText = inputField.value;
      itemList.appendChild(item);
      inputField.value = "";
    }
  });
};
