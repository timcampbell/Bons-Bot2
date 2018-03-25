const Discord = module.require("discord.js");
const Settings = module.require("../botSettings.json")

module.exports.run = async(bot, message, args) => {
	let embed = new Discord.RichEmbed()
		.setColor("#9B59B6")
		.setThumbnail(bot.user.avatarURL);

	if(args.length<1)
		await overview(bot, message, embed);
	else
		await specific(bot, message, embed, args[0])
}

async function overview(bot, message, embed){

	categories = Settings.cmdCategories;

	categories.forEach(cat => {
		cmds = '';
		bot.commands.forEach( command => {
			if(!command.help.hidden && command.help.category === cat)
				cmds+=`${command.help.name}, `;
		});
		cmds = cmds.substring(0, cmds.length-2);

		embed.addField(cat, cmds);
	})

	return message.channel.send(embed);
}

async function specific(bot, message, embed, cmd){
	command = bot.commands.get(cmd);

	embed.addField(command.help.name, command.help.usage);

	return message.channel.send(embed);
}

module.exports.help = {
	name: "help",
	usage: "<help",
	hidden: false,
	category: "Help"
}