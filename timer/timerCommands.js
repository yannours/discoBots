const cfg = require("./config.json");
const fs = require("fs");
const exec = require('child_process').exec;

//basic commands tab add bottom you custom cmds
var commands = [];
commands["ping"] = ping;
commands["pong"] = pong;
commands["prefix"] = prefix;
commands["id"] = id;
commands["atwl"] = addToWhiteList;
commands["rfwl"] = removeFromWhiteList;
commands["help"] = botHelp;
//------------------------------------------------------------------------------//
//  add a line for each method
//------------------------------------------------------------------------------//
//commands["it"] = invasionTimer;
commands["gl"] = giphyLinks;

module.exports.commands = commands;

//------------------------------------------------------------------------------//
//  methods to add or uodate
//------------------------------------------------------------------------------//

//return bot usage, add bottom you custom funcs
function botHelp(message) {
	var text = "Hey dummies !\n\n";
	text += "Here is the list of commands I can do:\n\n";
	text += "'"+cfg.prefix+"ping' -> Just a test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"pong' -> Another test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"prefix' -> Admin command to set the prefix.\n";
	text += "'"+cfg.prefix+"id' -> Return your discord ID (debug purpose).\n";
	text += "'"+cfg.prefix+"help' -> The actual command, list the possible commands.\n";
	text += "'"+cfg.prefix+"atwl' -> Admin command, add a user from whitelist.\n";
	text += "'"+cfg.prefix+"rfwl' -> Admin command, remove a user from whitelist.\n\n";
	text += "'"+cfg.prefix+"it' -> Get the invasion timer.\n";
	//text += "'"+cfg.prefix+"gl' -> Test of web crawl.\n";
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

//get a link to a gif from giphy with content args (test for advance crawling)
//cut from the callable cmds because discord already got it with integrated purpose
function giphyLinks(message, args) {
	if (typeof args[0] === 'undefined') {
		var url = "explore/random/";
	} else {
		var url = "search/"+args.join("-");
	}
	execute('phantomjs --ssl-protocol=any giphyPhantom.js https://giphy.com/'+url, function(stdout) {
		//console.log(stdout);
		message.channel.send(stdout);
	});
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
