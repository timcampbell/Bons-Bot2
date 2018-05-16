const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {
	
	args.forEach( a => {
		message.channel.send(a);
	})
	return;

}

module.exports.help = {
	name: "test",
	usage: `${botSettings.prefix}test`,
	hidden: true,
	category: "Misc"
}