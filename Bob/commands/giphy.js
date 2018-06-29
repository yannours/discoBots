//------------------------------------------------------------------------------//
//  GIPHY - basic commands to use GIPHY API
//------------------------------------------------------------------------------//
const cfg = require("./../config.json");
const get = require('http').get;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function gAnswer(message, url, type, data) {
	switch (type) {
		case "search":
			tag = url.match("&q=(.[^&]*)")[1];
			gif = data[0].url;
			break;
		case "random":
			try {
				tag = url.match("&tag=(.[^&]*)")[1];
			} catch (e) {
				tag = 'N/A';
			}
			gif = data.url;
			break;
		case "trending":
			tag = type;
			gif = data[0].url;
			break;
		default:
			tag = "N/A";
			gif = "N/A";
			break;
	}
	try {
		JSON.parse(data);
		data = JSON.parse(data).data;
		if (type == "random")
			gif = data.url;
		else
			gif = data[0].url;
		console.log(gif);
		message.channel.send(gif);
	} catch (e) {
		console.log("Error: "+e+"");
		message.channel.send("No gif found for '"+tag+"' soz bro :cry:");
	}
}

function gExec(message, url, type) { // url.match("&q=(.[^&]*)")
	console.log(url);
	get(url, (resp) => {
		let data = '';
		// A chunk of data has been recieved.
		resp.on('data', (chunk) => {
		  data += chunk;
		});
		// The whole response has been received. Print out the result.
		resp.on('end', () => {
			gAnswer(message, url, type, data);
		});
	}).on("error", (err) => {
		message.channel.send("There is an unexpected error, check bot logs to investigate.");
		console.log("Error: " + err.message);
	});
}

function gifs(message, args) {
	endPoint = cfg.giphy.url+cfg.giphy.apis.search+"?api_key="+cfg.giphy.key;
	if (typeof args[0] == 'undefined') {
		return gifr(message, args);
	}
	q = "";
	args.forEach( function(element, index) {
		q += (index!=0?'+':'')+element;
	});
	options = "&q="+q+"&limit="+cfg.giphy.limit+"&offset="+getRandomInt(cfg.giphy.limit)+"&lang="+cfg.giphy.lang;
	url = endPoint+options;
	gExec(message, url, "search");
}

function gift(message, args) {
	endPoint = cfg.giphy.url+cfg.giphy.apis.trending+"?api_key="+cfg.giphy.key;
	options = "&limit="+cfg.giphy.limit+"&offset="+getRandomInt(cfg.giphy.limit);
	url = endPoint+options;
	gExec(message, url, "trending");
}

function gifr(message, args) {
	endPoint = cfg.giphy.url+cfg.giphy.apis.random+"?api_key="+cfg.giphy.key;
	if (typeof args[0] != 'undefined') {
		args.forEach( function(element, index) {
			endPoint += (index!=0?'+':'&tag=')+element;
		});
	}
	gExec(message, endPoint, "random");
}

module.exports = function (commands) {
	commands['gif'] = gifs;
	commands['gifs'] = gifs;
	commands['gift'] = gift;
	commands['gifr'] = gifr;
}
