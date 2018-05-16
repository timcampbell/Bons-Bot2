const botSettings = module.require("../botSettings.json");

module.exports.run = async (bot, message, args) => {
	let member = message.mentions.users.first() || message.author;
	let msg = await message.channel.send("Generating avatar...");

	await message.channel.send({files: [
		{
			attachment: member.displayAvatarURL,
			name: "avatar.png"
		}	
	]});

	msg.delete();
}

module.exports.help = {
	name: "avatar",
	usage: `${botSettings.prefix}avatar [mention]`,
	hidden: false,
	category: "Images"
}