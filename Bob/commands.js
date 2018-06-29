const cfg = require("./config.json");
const fs = require("fs");

//basic commands tab add bottom you custom cmds
let commands = [];
commands["help"] = usage;
fillCommands('./commands');

module.exports.commands = commands;

function fillCommands(directory) {
	fs.readdir(directory, (err, files) => {
		files.forEach(file => {
			require(directory + '/' + file)(commands);
		});
	});
}

function usage(message) {
	let usage = '';
	for (var element in commands) {
		usage += cfg.prefix + element + '\n';
	}
	message.channel.send(usage);
}
