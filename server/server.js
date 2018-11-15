const path = require('path');
const express=require('express');
const http=require('http');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage}= require('./utils/message');

const publicpath=path.join(__dirname, '../public' );
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);

io.on('connection',(socket) => {
	console.log('new user connected');

	 socket.emit('newMessage',generateMessage('Admin','welcome to chat'));

            socket.broadcast.emit('newMessage', generateMessage('Admin','new user joined chat')); 

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

	socket.on('createMessage',(newMessage,callBack) => {
		console.log('createMessage',newMessage);
            
		io.emit('newMessage', generateMessage(newMessage.from,newMessage.text));
		callBack('this is from server');

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
	});


});



app.use(express.static(publicpath));

server.listen(port,() => {
	console.log(`server started at port ${port}`);
});