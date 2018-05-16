const cfg = require("./config.json");
const fs = require("fs");
const exec = require('child_process').exec;
const get = require('http').get;

//basic commands tab add bottom you custom cmds
var commands = [];
commands["ping"] = ping;
commands["pong"] = pong;
commands["prefix"] = prefix;
commands["id"] = id;
commands["atwl"] = addToWhiteList;
commands["rfwl"] = removeFromWhiteList;
commands["ahelp"] = botAdminUsage;
commands["help"] = botBasicUsage;
//------------------------------------------------------------------------------//
//  add a line for each method
//------------------------------------------------------------------------------//
//commands["it"] = invasionTimer;
commands["gif"] = gSearch;
commands["gifs"] = gSearch;
commands["gifr"] = gRandom;
commands["gift"] = gTrending;

module.exports.commands = commands;

//------------------------------------------------------------------------------//
//  methods to add or uodate
//------------------------------------------------------------------------------//

//return bot usage, add bottom you custom funcs
function botAdminUsage(message) {
	var text = "Hey dummies !\n\n";
	text += "Here is the list of commands I can do:\n\n";
	text += "'"+cfg.prefix+"ping' -> Just a test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"pong' -> Another test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"prefix' -> Admin command to set the prefix.\n";
	text += "'"+cfg.prefix+"id' -> Return your discord ID (debug purpose).\n";
	text += "'"+cfg.prefix+"ahelp' -> The actual command, list the possible commands.\n";
	text += "'"+cfg.prefix+"atwl' -> Admin command, add a user from whitelist.\n";
	text += "'"+cfg.prefix+"rfwl' -> Admin command, remove a user from whitelist.\n\n";
	//text += "'"+cfg.prefix+"it' -> Get the invasion timer.\n";
	text += "'"+cfg.prefix+"gif' -> Return a random giphy gif (you can add a tag param e.g: '"+cfg.prefix+"gif macron').\n";
	text += "'"+cfg.prefix+"gift' -> Return a trending giphy gif.\n";
	text += "\nThanks for watching and cyousoon !\n"
	message.channel.send(text);
}

//return bot usage, add bottom you custom funcs
function botBasicUsage(message) {
	var text = "Hey dummies !\n\n";
	text += "Here is the list of commands I can do:\n\n";
	text += "'"+cfg.prefix+"ping' -> Just a test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"id' -> Return your discord ID (debug purpose).\n";
	text += "'"+cfg.prefix+"help' -> The actual command, list the possible commands.\n";
	text += "'"+cfg.prefix+"gif' -> Return a random giphy gif (you can add a tag param e.g: '"+cfg.prefix+"gif macron').\n";
	text += "'"+cfg.prefix+"gift' -> Return a trending giphy gif.\n";
	text += "\nThanks for watching and cyousoon !\n"
	message.channel.send(text);
}

//basic exec cmd packaged with CB
function execute(command, callback) {
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}

//execute phantomjs script witch get the timer for invasion
function invasionTimer(message, args) {
	execute('phantomjs --ssl-protocol=any invasionPhantom.js https://wow.gameinfo.io/invasions', function(stdout) {
		message.channel.send(stdout);
	});
}

/* V0 - inspirationnal code
//get a link to a gif from giphy with content args (test for advance crawling)
//cut from the callable cmds because discord already got it with integrated purpose
function giphyLinks(message, args) {
	//if (typeof args[0] === 'undefined') {
	//	var url = "explore/random/";
	//} else {
	//	var url = "search/"+args.join("-");
	//}
	//console.log('https://giphy.com/'+url);
	//execute('phantomjs --ssl-protocol=any giphyPhantom.js https://giphy.com/'+url, function(stdout) {
	//	console.log(stdout);
	//	message.channel.send(stdout);
	//});
	APIHost = "http://api.giphy.com";
	APIRandom = "/v1/gifs/random";
	APIKey = "?api_key="+cfg.giphy.key;
	APIOptions = "";
	APIRating = "";
	GIPHYRatings = ["g", "y", "pg-13"];
	if (typeof args[0] === 'undefined') {
	} else {
		//APIOptions = "&tag="+args[0]+"&rating="+(typeof args[1] === 'undefined'? 'g' :args[1]);
		APIOptions = "&tag=";
		args.forEach( function(element, index) {
			if (GIPHYRatings.indexOf(element) === -1) {
				APIOptions += (index != 0 ? '+' : '')+element;
			} else {
				APIRating = "&rating="+element;
			}
		});
	}
	url = APIHost+APIRandom+APIKey+APIOptions+APIRating;
	gExec(message, url, "random");
}
*/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function gExec(message, url, type) { // url.match("&q=(.[^&]*)")
	console.log(url);
	switch (type) {
		case "search":
			tag = url.match("&q=(.[^&]*)")[1];
			gif = data[0].url;
			break;
		case "random":
			tag = url.match("&tag=(.[^&]*)")[1];
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
	get(url, (resp) => {
		let data = '';
		// A chunk of data has been recieved.
		resp.on('data', (chunk) => {
		  data += chunk;
		});
		// The whole response has been received. Print out the result.
		resp.on('end', () => {
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
		});
	}).on("error", (err) => {
		message.channel.send("There is an unexpected error, check bot logs to investigate.");
		console.log("Error: " + err.message);
	});
}

function gSearch(message, args) {
	endPoint = cfg.giphy.url+cfg.giphy.apis.search+"?api_key="+cfg.giphy.key;
	if (typeof args[0] == 'undefined') {
		return gRandom();
	}
	q = "";
	args.forEach( function(element, index) {
		q += (index!=0?'+':'')+element;
	});
	options = "&q="+q+"&limit="+cfg.giphy.limit+"&offset="+getRandomInt(cfg.giphy.limit)+"&lang="+cfg.giphy.lang;
	url = endPoint+options;
	gExec(message, url, "search");
}

function gTrending(message, args) {
	endPoint = cfg.giphy.url+cfg.giphy.apis.trending+"?api_key="+cfg.giphy.key;
	options = "&limit="+cfg.giphy.limit+"&offset="+getRandomInt(cfg.giphy.limit);
	url = endPoint+options;
	gExec(message, url, "trending");
}

function gRandom(message, args) {
	endPoint = cfg.giphy.url+cfg.giphy.apis.random+"?api_key="+cfg.giphy.key;
	if (typeof args[0] != 'undefined') {
		args.forEach( function(element, index) {
			endPoint += (index!=0?'+':'&tag=')+element;
		});
	}
	gExec(message, endPoint, "random");
}
//------------------------------------------------------------------------------//
//  utils - basic commands to manage whitelist & admin
//------------------------------------------------------------------------------//

//@TODO create functionnality for blacklist, anti-spam and language etc

function ping(message) {
	message.channel.send("Uoin");
}

function pong(message) {
	message.channel.send("Bière");
}

//chang the bot cmds prefix
function prefix(message, args) {
	if (!areYouOwner(message)) {return;}
	if (typeof args[0] === 'undefined') {
		message.channel.send("You need to add a new prefix e.g. \""+cfg.prefix+"prefix newPrefix\"");
		return;
	}
	let newPrefix = args[0];
	cfg.prefix = newPrefix;
	fs.writeFile("./config.json", JSON.stringify(cfg), (err) => console.error);
	message.channel.send("Command prefix is now "+cfg.prefix);
}

//return discord id of message owner
function id(message) {
	message.channel.send(message.author.id);
}

function areYouOwner(message) {
	if (message.author.id !== cfg.ownerID) {
		message.channel.send("You need to be the BOT owner to use this.");
		return (false);
	}
	return (true);
}

function addToWhiteList(message) {
	if (!areYouOwner(message)) {return;}
	if (message.mentions.members === null) {return;}
	var member = message.mentions.members.first();
	var index = cfg.whiteListed.indexOf(member.id);
	if (index > -1) {
		message.channel.send(member.user.username+" is already whitelisted.");
	} else {
		cfg.whiteListed.push(member.id);
		fs.writeFile("./config.json", JSON.stringify(cfg), (err) => console.error);
		message.channel.send(member.user.username+" is now whitelisted.");
	}
}

function removeFromWhiteList(message) {
	if (!areYouOwner(message)) {return;}
	if (message.mentions.members === null) {return;}
	var member = message.mentions.members.first();
	var index = cfg.whiteListed.indexOf(member.id);
	if (index > -1) {
		cfg.whiteListed.splice(index, 1);
		fs.writeFile("./config.json", JSON.stringify(cfg), (err) => console.error);
		message.channel.send(member.user.username+" is now removed from whitelist.");
	} else {
		message.channel.send(member.user.username+" is not whitelisted at all.");
	}
}

function areYouWhiteListed(message) {
	for (var i in cfg.whiteListed) {
		if (message.author.id == cfg.whiteListed[i]) {
			return (true);
		}
	}
	message.channel.send("You need to be whitelisted to do this. Ask an admin.");
	return (false);
}

function regexCheck(line, match) {
	var ret = false;
	var name = line.match(match);
	if (name != null && typeof name[1] !== 'undefined') {
		ret = name[1];
	}
	return (ret);
}
