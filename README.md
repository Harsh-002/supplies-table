# supplies-table

## Features

- Add new row to table
- Move rows up and down
- Delete rows
- Refresh the data
- Edit and save new data

## Technology used

- HTML, CSS and javascript
- Bootstrap icons

## Installation

    Run "index.html" in browser or start live-server from VS code

## Development and structure

### index.html

1. I created the index.html file to give the project a structure
2. Used google fonts and bottstrap icons

### style.css

1. Used custom styling throughout the application
2. No extra libraries used

### data.js

1. Used Chat-GPT to get dummy data and stored in data.js file
2. Exporting this data using modules

### script.js

1. Imported data from data.js file and stored a shallow copy of original data
2. Created a "tableRow({
   id,
   chemical_name,
   vendor,
   density,
   viscosity,
   packaging,
   pack_size,
   unit,
   quantity,
   })" function which takes rows data as arguments and creates a new row
3. Initialized a "tableRows" array which holds all the current rows
4. Initialized a "selectedRow" variable which holds current selected row
5. Created "setSelectedRow(row)" function which changes the selected row
6. "appendRows(data, index)" function takes the shallow copy of data which we created in staring and creates new rows for each data object and appends it to "tableRows"
7. "appendRows()" function also adds event listener on all of the rows to change the selected row
8. "Button" class initializes a new button and we can pass icon and a callback to it
9. Get the "buttons" container using document.getElementById
10. Create buttons using "Button" class and append all buttons to "buttons" container
11. Get the form which takes input for adding new row
12. "hideForm()" function hides the form and "showForm()" function shows the form by adding and removing css classes on form element
13. Add a event listener on form which fires when form is submitted, takes all input from form data and stores in "formData" then creates "newRow" object which has all the properties required to create a new row
14. "newRow" is pushed to the "data" copy and "appendRows()" function is called with new "data"
15. "moveDownfn()" and "moveUpFn()" takes "data" and "selectedRow" as argument and moves rows down and up respectively
16. "deleteRow()" function takes selected row, removes it from "data" and re-renders the new "data" using "appendRows()" and also updates the "selectedRow"
17. "refreshFn()" calls "appendRows()" with original data
18. "editFn()" takes the current row and makes it editable by setting all the inputs to "disabled = false"
19. "saveFn()" function takes the data from all inputs in a row and updates them in the "data" array and re-renders all content with updated data
20. "tableHeads" array contains all table heads and a click event is applied to all of them which calls "sort()" function
21. "sort()" function sorts the rows based on the clicked table head by using javascript built-in sort() function and a "sortOrder" is defined which helps in deciding whether to sort in ascending or descending
