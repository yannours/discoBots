//------------------------------------------------------------------------------//
//  ADMIN - basic commands to manage whitelist & admin
//------------------------------------------------------------------------------//
const cfg = require("./../config.json");
const fs = require("fs");

function areYouOwner(message) {
	if (message.author.id !== cfg.ownerID) {
		message.channel.send("You need to be the BOT owner to use this.");
		return (false);
	}
	return (true);
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

function ping(message) {
	message.channel.send("Uoin");
}

function pong(message) {
	message.channel.send("Bière");
}

//chang the bot cmds prefix
function prefix(message, args) {
	if (!areYouWhiteListed(message)) {return;}
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

function addw(message) {
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

function removew(message) {
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

function mute(message) {
	message.channel.send('Not yet implemented.');
}

function blacklist(message) {
	message.channel.send('Not yet implemented.');
}

function moderate(message, args) {
	let flag = false;

	if (!areYouWhiteListed(message)) {return;}
	if (typeof args[0] === 'undefined') {
		message.channel.send('Usage:\n$> ' + cfg.prefix + 'moderate mustContainThisWordToNotBeingRemoved');
		return;
	}
	for (var moderate in cfg.moderated) {
		if (moderate === message.channel.name) {
			if (typeof cfg.moderated[moderate] !== 'undefined' && !cfg.moderated[moderate].includes(args[0])) {
				flag = true;
				cfg.moderated[moderate].push(args[0]);
				message.channel.send('"' + args[0] + '" ajouté en filtre de modération pour le chan "' + message.channel.name + '".');
			} else if (typeof cfg.moderated[moderate] !== 'undefined' && cfg.moderated[moderate].includes(args[0])) {
				flag = true;
				cfg.moderated[moderate].splice(cfg.moderated[moderate].indexOf(args[0]), 1);
				message.channel.send('"' + args[0] + '" retiré en filtre de modération pour le chan "' + message.channel.name + '".');
			}
		}
	}
	if (!flag) {
		cfg.moderated[message.channel.name] = [args[0]];
		message.channel.send('"' + args[0] + '" ajouté en filtre de modération pour le chan "' + message.channel.name + '".');
	}
	fs.writeFile("./config.json", JSON.stringify(cfg), (err) => console.error);
}

//@TODO create functionnality for blacklist, anti-spam and language etc
module.exports = function (commands) {
	commands['ping'] = ping;
	commands['pong'] = pong;
	commands['prefix'] = ping;
	commands['id'] = ping;
	commands['addw'] = addw;
	commands['removew'] = removew;
	commands['mute'] = mute;
	commands['blacklist'] = blacklist;
	commands['moderate'] = moderate;
}
