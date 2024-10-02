import { invoices } from "./data.js";

// Create a copy of original data
let data = Array.from(invoices);

// Function to create a table row
const tableRow = ({
  id,
  chemical_name,
  vendor,
  density,
  viscosity,
  packaging,
  pack_size,
  unit,
  quantity,
}) => {
  return `
          <td data-id="${id}">${id}</td>
          <td class="border-r">${chemical_name}</td>
          <td>${vendor}</td>
          <td><input name="density" class="input" type="text" value="${density}" disabled></td>
          <td><input name="viscosity" class="input" type="text" value="${viscosity}" disabled></td>
          <td>${packaging}</td>
          <td>${pack_size}</td>
          <td>${unit}</td>
          <td><input name="quantity" class="input" type="text" value="${quantity}" disabled></td>
    `;
};

const tableRows = document.getElementById("table-rows");

// Create array of all table rows
let tableRowsArray = Array.from(tableRows.children);

// Initialize seletedRow variable
let selectedRow = null;

// Function to set selected row
function setSelectedRow(row) {
  tableRowsArray.map((row) => row.classList.remove("selected-row"));
  selectedRow = row;
  selectedRow.classList.add("selected-row");
}

//Creates data rows using chemicals data and appends it to tableRows
function appendRows(data, index) {
  tableRows.innerHTML = "";
  data.forEach((chemical) => {
    const newRow = document.createElement("tr");

    newRow.classList.add("row");

    newRow.innerHTML = tableRow({ ...chemical });

    tableRows.appendChild(newRow);
  });

  // Update tableRowsArray with new data
  tableRowsArray = Array.from(tableRows.children);

  // Add event listener to all rows
  tableRowsArray.map((row) =>
    row.addEventListener("click", () => setSelectedRow(row))
  );

  // Set selected row after deleting a row
  if (selectedRow) {
    if (tableRowsArray.length === 0) {
      return;
    }
    if (index === tableRowsArray.length) {
      setSelectedRow(tableRowsArray[index - 1]);
    } else {
      setSelectedRow(tableRowsArray[index]);
    }
  }
}

appendRows(invoices);

//Button class to create toolbar button
class Button {
  constructor(label, onClick) {
    this.label = label;
    this.onClick = onClick;
  }

  createButton() {
    const newButton = document.createElement("button");
    newButton.innerHTML = `<i class="bi bi-${this.label}"></i>`;
    newButton.classList.add("btn");
    newButton.addEventListener("click", this.onClick);
    return newButton;
  }
}

//Getting buttons container
const buttons = document.getElementById("buttons");

// Functions for all buttons ------------>
const addForm = document.getElementById("form");
const cancelBtn = document.getElementById("cancel-btn");
let idInput = document.getElementById("id");

// Function to close add Form
function hideForm() {
  addForm.classList.remove("show");
}

// Button to close the add form
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  hideForm();
});

// Function to show add Form
function showForm() {
  idInput.value = data.length + 1;
  addForm.classList.add("show");
}

// Add new row on Form submission
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let formData = new FormData(addForm);

  formData = Object.fromEntries(formData.entries());

  const newRow = {
    id: parseInt(formData.id),
    chemical_name: formData.chemical_name,
    vendor: formData.vendor,
    density: formData.density,
    viscosity: formData.viscosity,
    packaging: formData.packaging,
    pack_size: formData.pack_size,
    unit: formData.unit,
    quantity: formData.quantity,
  };

  data.push(newRow);

  appendRows(data);

  addForm.reset();

  hideForm();
});

// Move down function
function moveDownFn(data, row) {
  const id = parseInt(row.children[0].dataset.id);

  const currentIdx = data.findIndex((item) => item.id === id);

  if (currentIdx < data.length - 1) {
    const nextIdx = currentIdx + 1;
    [data[currentIdx], data[nextIdx]] = [data[nextIdx], data[currentIdx]];
  }

  const nextRow = row.nextElementSibling;

  if (nextRow) {
    row.parentNode.insertBefore(nextRow, row);
  }
}

// Move up function
function moveUpFn(data, row) {
  const id = parseInt(row.children[0].dataset.id);

  const currentIdx = data.findIndex((item) => item.id === id);

  if (currentIdx > 0) {
    const prevIdx = currentIdx - 1;
    [data[currentIdx], data[prevIdx]] = [data[prevIdx], data[currentIdx]];
  }

  const prevRow = row.previousElementSibling;

  if (prevRow) {
    row.parentNode.insertBefore(row, prevRow);
  }
}

// Delete Function
function deleteRow(data, row) {
  const id = parseInt(row.children[0].dataset.id);

  const index = data.findIndex((item) => item.id === id);

  if (index !== -1) {
    data.splice(index, 1);
  }

  appendRows(data, index);
}

// Refresh Data Function after confirming
function refreshFn() {
  const confirmation = confirm("This will reset all data!");
  if (confirmation) appendRows(invoices);
}

// Edit Data Function
function editFn(row) {
  const inputs = Array.from(row.querySelectorAll("input"));

  inputs.map((input) => {
    input.disabled = false;
  });
}

// Save Data Function
function saveFn(data, row) {
  const inputs = Array.from(row.querySelectorAll("input"));

  const id = parseInt(row.children[0].dataset.id);

  const index = data.findIndex((item) => item.id === id);

  inputs.forEach((input) => {
    let identifier = input.name;
    data[index][identifier] = input.value;
    input.disabled = true;
  });
}

//Creating and appending each button to buttons container
const addButton = new Button("plus-lg", () => showForm());
buttons.appendChild(addButton.createButton());
const moveDown = new Button("arrow-down", () => moveDownFn(data, selectedRow));
buttons.appendChild(moveDown.createButton());
const moveUp = new Button("arrow-up", () => moveUpFn(data, selectedRow));
buttons.appendChild(moveUp.createButton());
const deleteButton = new Button("trash", () => deleteRow(data, selectedRow));
buttons.appendChild(deleteButton.createButton());
const refresh = new Button("arrow-clockwise", () => refreshFn());
buttons.appendChild(refresh.createButton());
const edit = new Button("pencil-square", () => editFn(selectedRow));
buttons.appendChild(edit.createButton());
const save = new Button("save", () => saveFn(data, selectedRow));
buttons.appendChild(save.createButton());

// Getting all table heads
let tableHeads = document.querySelectorAll(".t-head");

// Initializing sortOrder (1 for ascending order, -1 for descending order)
let sortOrder = 1;

// Function to sort data based on specific property
function sort(head) {
  let key = head.dataset.key;

  data.sort((a, b) => {
    if (a[key] < b[key]) return -1 * sortOrder;
    if (a[key] > b[key]) return 1 * sortOrder;
    return 0;
  });

  sortOrder *= -1;

  appendRows(data);
}

// Applying click functionality to all table heads
tableHeads.forEach((head) => head.addEventListener("click", () => sort(head)));
