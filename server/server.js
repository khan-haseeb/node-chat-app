const path = require('path');
const express=require('express');
const http=require('http');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage}= require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users} =require('./utils/users');

const publicpath=path.join(__dirname, '../public' );
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);
var users=new Users();

io.on('connection',(socket) => {
	console.log('new user connected');

	 
	/*socket.emit('newEmail',{
		from: 'haseebk521@gmail.com',
		text:'hello there',
		created: 123
	});*/

	
	/*socket.on('createEmail',(newEmail) => {
		console.log('createEmail',newEmail);
	});*/

	/*socket.emit('    ',{
		from:'ali@gmail.com',
		text:'hello haseeb',
		created:1234
	});*/

	socket.on('join', (params,callBack) => {

		if(!isRealString(params.name) || !isRealString(params.room))
		{
			return callBack('name and rooms are required');
		}

		socket.join(params.room);
		users.removeUser(socket.id);

		users.addUser(socket.id,params.name,params.room);
		io.to(params.room).emit('updateUserList',users.getUserList(params.room));

		socket.emit('newMessage',generateMessage('Admin','welcome to chat'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`)); 

		callBack();
            
	});

	socket.on('createMessage',(newMessage,callBack) => {
		console.log('createMessage',newMessage);
            
		io.emit('newMessage', generateMessage(newMessage.from,newMessage.text));
		callBack('');

		/*socket.broadcast.emit('newMessage', {
			from:newMessage.from,
			text: newMessage.from,
			createdAt:new Date().getTime()
		})*/
	});

	socket.on('createLocationMessage',(coords) => {
		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
	})

	socket.on('disconnect', () => {
		console.log('disconnected form client');

		var user=users.removeUser(socket.id);

		if(user)
		{
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left chat`));
		}
	});




});



app.use(express.static(publicpath));

server.listen(port,() => {
	console.log(`server started at port ${port}`);
});