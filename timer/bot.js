const Discord = require("discord.js");
const client = new Discord.Client();
const cfg = require("./config.json");
const fs = require("fs");
const cmds = require("./"+cfg.name+"Commands.js");

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
	fs.appendFile("./"+cfg.name+".log", logs, (err) => console.error);
}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(cfg.prefix) && cfg.botOnly) {
		message.delete();
	} else {
		const args = message.content.slice(cfg.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		log(message);
		//if cmd exist in cmds, use it :!
		if (typeof cmds.commands[command] !== 'undefined') {
			cmds.commands[command](message, args);
		}
	}
});

client.login(cfg.token);
