var expect=require('expect');

var {generateMessage,generateLocationMessage}=require('./message');

describe('generateMessage', () => {

	it('it shooul generate correct message object', () => {

		var from="haseeb";
		var text="some text"
		var message=generateMessage(from,text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({
			from,
			text
		});

	});

});

describe('generateLocationMessage',() => {
	it('it shooul generate correct locaiton'), () => {

		var from="haseeb";
		var latitude=12;
		var longitude=91;
		var url='http://google.com/maps?q=12,19';

		var message=generateLocationMessage(from,latitude,longitude);

		expect(message.createdAt).toBeA('number');

		expect(message).toInclude({
			from,
			url
		});

	}
});