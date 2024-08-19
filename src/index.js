// This is the main entry point of the application
let inputField;
let itemList;

document.addEventListener('DOMContentLoaded', event => {
	inputField = document.getElementById("inputField");
	itemList = document.getElementById("itemList");
 
	inputField.addEventListener("keydown", (event) => {
	  if (event.key === "Enter") {
		 const item = document.createElement("li");

		 item.innerText = inputField.value;
		 itemList.appendChild(item);
		 inputField.value = "";
	  }
	}); 
});
