const chatform = document.querySelector('#chat-form');
const chatmessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,

  });
socket.emit('joinroom',{username,room});
console.log(username,room);
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });

socket.on('message',message=>
{
    console.log(message);
    outputmessage(message);
    chatmessages.scrollTop = chatmessages.scrollHeight;
});

//sending message to every user who join the chat room
function outputmessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    const add = document.querySelector('.chat-messages');
    add.appendChild(div);
};

chatform.addEventListener('submit',e=>
{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
    socket.emit('chat-message',msg);

});
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
