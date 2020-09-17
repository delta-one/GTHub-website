const https = require('https');

let data = '';

module.exports.getWecData = (req, res) => {
	// console.log('RECEIVED REQUEST AT ' + new Date());
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.json({
		data: data
	});
};

setInterval(() => {
	fetchData();
}, 5 * 1000);

fetchData = function() {
	let rn = Math.random();
	https.get('https://storage.googleapis.com/fiawec-prod/assets/live/WEC/__data.json?json=' + rn, response => {
		let tmp = '';

		// A chunk of data has been recieved
		response.on('data', chunk => {
			tmp += chunk;
		});

		// The whole response has been received
		response.on('end', () => {
			let tmp2 = JSON.parse(tmp);
			delete tmp2.driversResult;
			data = JSON.stringify(tmp2);
			// console.log('UPDATE FROM SOURCE AT ' + new Date());
		});
	}, err => {
		console.log(err);
	});
};

fetchData();
