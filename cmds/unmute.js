const fs = module.require("fs");
const botSettings = module.require("../botSettings.json");

module.exports.run = async (bot, message, args) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the manage messages permission");

	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if(!toMute) return message.channel.send("You did not specify a user mention!");

	let role = message.guild.roles.find(r => r.name === "Bot Mute");

	if(!role || !toMute.roles.has(role.id)) return message.channel.send("This user is not muted!");

	await toMute.removeRole(role);
	
	delete bot.mutes[toMute.id];
	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
		if(err) throw err;
		message.channel.send("I have unmuted them.");	
	});
	
	return;
}

module.exports.help = {
	name: "unmute",
	usage: `${botSettings.prefix}unmute <mention>`,
	hidden: false,
	category: "Admin"
}