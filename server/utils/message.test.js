var expect=require('expect');

var {generateMessage}=require('./message');

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