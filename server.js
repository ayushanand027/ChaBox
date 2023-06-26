const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');
const formatmessage = require('./utility/message.js');
const {userJoin, getCurrentUser,userLeave,
    getRoomUsers} = require('./utility/users.js');

const port = 3000 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static('public'));
const admin = 'bot';

io.on('connection',socket=>
{
    socket.on('joinroom',({username,room})=>{
       const user = userJoin(socket.id,username,room);
       socket.join(user.room);

        socket.emit('message',formatmessage(admin,"Welcome to real time chat application"));

socket.broadcast.to(user.room).emit("message", formatmessage(admin, `${user.username} has joined the chat`));
    io.to(user.room).emit("roomUsers", {
    room: user.room,
    users: getRoomUsers(user.room),
  });

    });
    //listening for the chat message send by the user
    socket.on('chat-message',msg=>
    {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatmessage(user.username,msg));
    });
    //when any user left the chat 
    socket.on('disconnect',()=>
    {
        const user = userLeave(socket.id);
        if(user)
        {io.to(user.room).emit('message',formatmessage(admin, `${user.username} left the chat`));
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
    }
        
    });

    

});

server.listen(port,()=>
{
    console.log(`Server is listening on port number ${port}`);
});