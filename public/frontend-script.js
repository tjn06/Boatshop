window.addEventListener('load', () => {
    const inputPort = document.querySelector('#inputPort');
    const requestTypes = document.querySelectorAll('input[name=requestType]');
    const querystring = document.querySelector('#querystring');
    const requestBody = document.querySelector('#requestBody');
    const destinationUrl = document.querySelector('#destinationUrl');
    const buttonRequest = document.querySelector('#buttonRequest');
    const resultDiv = document.querySelector('#resultDiv');
    const inputUrl = document.querySelector('#inputUrl');

    let url = '';
    let requestType = 'GET';
    update();

    function update() {
		url = `http://localhost:${inputPort.value}${inputUrl.value}?${querystring.value}`;
        destinationUrl.innerText = `${url} (${requestType})`;
    }

    inputPort.addEventListener('change', update);
    requestTypes.forEach(radio => {
		radio.addEventListener('change', e => {
			requestType = e.target.value; update();
		})
	})
	inputUrl.addEventListener('change', update);
    querystring.addEventListener('change', update);
    buttonRequest.addEventListener('click', async () => {
        buttonRequest.disabled = true;
        buttonRequest.innerText = 'Request underway...'
        let body = requestBody.value;
		resultDiv.innerText = 'Awaiting result';
        try {
			let response;
			if( requestType === 'GET' ) {
				console.log('About to send GET request');
				response = await fetch(url, { method: 'GET' });
			} else {
				console.log('About to send request with body: ', body);

				// HEADERS are important, Express will ignore the body if they are not present
				// BODY must be in string format, use JSON.stringify in your code
				response = await fetch(url, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					method: requestType,
					body: body
				});
			}
            const data = await response.json();
            console.log('Response data: ', data);
            resultDiv.innerText = JSON.stringify(data);
        } catch(error) {
			console.error(error);
			if( error.message.startsWith('Unexpected token') && response ) {
				let text = response.text();
				console.log('Response text: ', text);
	            resultDiv.innerText = text;
			} else {
				resultDiv.innerText = 'Error! Do you have a local web server? Do you use the correct port?\n' + error.message;
			}
        } finally {
            buttonRequest.disabled = false;
            buttonRequest.innerText = 'Make request'
        }
    })
})