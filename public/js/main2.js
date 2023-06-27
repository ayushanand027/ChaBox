const newroom = document.getElementById('newroom');
const newroom_button = document.getElementById('newroom_button');
const roomSelect = document.getElementById("room");

newroom_button.addEventListener('click', () => {
  const d = newroom.value;
  
  if (d) { // Check if d has a value
    var newOption = document.createElement("option");
    newOption.value = d;
    newOption.text = d;
    roomSelect.appendChild(newOption);
  }
});