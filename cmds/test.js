const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {
	
	for (var i = 0; i < 200; i++) {
		message.channel.send(`spam: ${i}`);
	}
	return;

}

module.exports.help = {
	name: "test",
	usage: "<test",
	hidden: true,
	category: "Misc"
}