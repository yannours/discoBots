const Discord = require("discord.js");
const client = new Discord.Client();
const cfg = require("./config.json");
const fs = require("fs");
const cmds = require("./commands.js").commands;

//date formated for logs
function myBotDate() {
	date = new Date();
	botDate = [];
	botDate["hr"] = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	botDate["ts"] = Math.floor(date.getTime()/1000);
	return (botDate);
}

//add a log line in bot file
function log(message) {
	logs = "["+myBotDate()["ts"]+"]["+myBotDate()["hr"]+"]["+message.author.id+"]["+message.author.username+"]["+message.content+"]\n";
	fs.appendFile("./bot.log", logs, (err) => console.error);
}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
	if (message.author.bot) {
		return;
	}
	if (typeof cfg.moderated[message.channel.name] !== 'undefined' && !message.content.startsWith(cfg.prefix)) {
		for (var index in cfg.moderated[message.channel.name]) {
			if (message.content.indexOf(cfg.moderated[message.channel.name][index]) <= -1) {
				message.delete();
				return;
			}
		}
	}
	if (message.content.startsWith(cfg.prefix)) {
		const args = message.content.slice(cfg.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		log(message);
		//if cmd exist in cmds, use it :!
		if (typeof cmds[command] !== 'undefined') {
			cmds[command](message, args);
		}
	}
	return;
});

client.login(cfg.token);
