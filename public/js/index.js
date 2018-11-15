var socket=io();

	socket.on('connect',function () {
		console.log('connected to server');

		/*socket.emit('createEmail',{
			from:'ali@gmail.com',
			text:'hello ali'
		})
*/
		/*socket.emit('createMessage', {
			from:'ali@gmail.com',
			text:'hello ali'
		})
	})*/

	socket.on('disconnect',function ()  {
		console.log('disconnected form server');
	})

	/*socket.on('newEmail',function (email) {

		console.log('new email',email);
	});*/

	socket.on('newMessage',function (message) {
		    var formattedTime=moment(message.createdAt).format('h: mm a');
			//console.log('new Message',message);

			var li=jQuery('<li></li>')
			li.text(`${message.from}: ${formattedTime}: ${message.text}`);

			jQuery('#messages').append(li);
		})
});

	socket.on('newLocationMessage',function (message) {
		var formattedTime=moment(message.createdAt).format('h: m a')
        var li=jQuery('<li></li>');
        var a=jQuery('<a target="_blank">send my location</a>');

        li.text(`${message.from}: ${formattedTime}:`);
        a.attr('href',message.url);

        li.append(a);
        jQuery('#messages').append(li);
	});

	jQuery('#message-form').on('submit', function (e)  {
       e.preventDefault();

       socket.emit('createMessage', {
       	from:'user',
       	text: jQuery('[name=message]').val()
       }, function () {

       	jQuery('[name=message]').val('');

       });

	});

	var locationButton=jQuery('#send-location');

	 locationButton.on('click' , function () {

	 	if(!navigator.geolocation)
	 	{
	 		return alert('geolocation is not supported in your browswer');
	 	}

	 	locationButton.attr('disabled','disabled').text('sending location...');

	 	navigator.geolocation.getCurrentPosition(function (position) {
            locationButton.removeAttr('disabled').text('send location');
	 		socket.emit('createLocationMessage', {
	 			latitude:position.coords.latitude,
	 			longitude:position.coords.longitude
	 		});

	 		
	 	}, function () {
	 		alert('unable to fetch location').text('send location');
	 		locationButton.removeAttr('disabled');
	 	})

	 });