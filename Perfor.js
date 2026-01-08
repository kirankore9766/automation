// 👍 GOOD - efficient
const list = document.getElementById("items");
const fragment = document.createDocumentFragment();

for (let i = 0; i < 10000; i++) {
  const li = document.createElement("li");
  li.textContent = "Item " + j;
  fragment.appendChild(li);
}

list.appendChild(fragment);    // only ONE DOM update
