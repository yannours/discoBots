const cfg = require("./rustyConfig.json");
const fs = require("fs");

var commands = [];
commands["ping"] = ping;
commands["pong"] = pong;
commands["prefix"] = prefix;
commands["id"] = id;
commands["pl"] = playerList;
//commands["sw"] = startWatch;
commands["atwl"] = addToWhiteList;
commands["rfwl"] = removeFromWhiteList;
commands["help"] = botHelp;

var playerList = [];
var anyone = false;
var isLogWatched = false;

module.exports.commands = commands;

function botHelp(message) {
	var text = "Hey dummies !\n\n";
	text += "Here is the list of commands I can do:\n\n";
	text += "'"+cfg.prefix+"ping' -> Just a test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"pong' -> Another test to see if I'm alive.\n";
	text += "'"+cfg.prefix+"prefix' -> Admin command to set the prefix.\n";
	text += "'"+cfg.prefix+"id' -> Return your discord ID (debug purpose).\n";
	text += "'"+cfg.prefix+"help' -> The actual command, list the possible commands.\n";
	text += "'"+cfg.prefix+"pl' -> Whitelisted command to Get the connected player list on the rust server.\n";
	//text += "'"+cfg.prefix+"sw' -> Admin command to watch rust server logs and output events when it comes.\n";
	text += "'"+cfg.prefix+"atwl' -> Admin command, add a user from whitelist.\n";
	text += "'"+cfg.prefix+"rfwl' -> Admin command, remove a user from whitelist.\n\n";
	text += "Thanks for watching and cyousoon !\n"
	message.channel.send(text);
}

function ping(message) {
	message.channel.send("Uoin");
}

function pong(message) {
	message.channel.send("Bière");
}

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

function playerList(message, args) {
	if (!areYouWhiteListed(message)) {return;}
	const path = '/home/rustserver/log/server';
	fs.readdir(path, (err, files) => {
		var count = 0;
		files.forEach(file => {
			fs.readFile(path+"/"+file, 'utf-8', function(err, data) {
			    if (err) throw err;
				count = count + 1;
			    var lines = data.trim().split('\n');
			    lines.forEach(line => {
			    	var ret = "";
			    	//console.log("'"+file+"'", "'"+line+"'", "'"+name[1]+"'", "'"+1+"'");
			    	if ((ret = regexCheck(line, "(.*)\\[.*\\] has entered the game")) !== false) {
			    		playerList[ret] = 1;
			    	} else if ((ret = regexCheck(line, ".*\/(.*) disconnecting: .*")) !== false) {
			    		playerList[ret] = 0;
			    	} else if ((ret = regexCheck(line, ".*\/(.*) kicked: .*")) !== false) {
			    		playerList[ret] = 0;
			    	}
			    });
				for (var i in playerList) {
					//console.log(i, playerList[i]);
					if (playerList[i] != 0 && count === files.length) {
						anyone = true;
						message.channel.send("Player "+i+" is connected.");
					}
				}
				console.log(anyone, "File: "+count+"/"+files.length);
				if (anyone === false && count === files.length) {
					message.channel.send("No player actually connected.");
				}
			});
		});
	});
}

function startWatch(message, args) {
	if (!areYouOwner(message)) {return;}
	if (isLogWatched) {
		return (true);
	} else {
		isLogWatched = true;
	}
	const path = '/home/rustserver/log/server';
	//const path = '.';
	var chokidar = require('chokidar');
	// One-liner for current directory, ignores .dotfiles
	var watcher = chokidar.watch(path, {ignored: /(^|[\/\\])\../}).on('change', (filename, stats) => {
		fs.readFile(filename, 'utf-8', function(err, data) {
		    if (err) throw err;
		    var lines = data.trim().split('\n');
		    var lastLine = lines.slice(-1)[0];
		    if (!regexCheck(lastLine, "\\(Filename: .*\\)")) {
		    	console.log(lastLine);
		    	message.channel.send(lastLine);
		    }
		});
	});
}


