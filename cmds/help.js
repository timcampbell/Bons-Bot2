const Discord = module.require("discord.js");
const Settings = module.require("../botSettings.json")

let profile;

module.exports.run = async(bot, message, args, con) => {
	

	con.query(`SELECT * FROM profiles WHERE UUID = '${message.author.id}';`, (err, rows) => {
		if (err) throw err;
		profile = rows[0];

		let embed = new Discord.RichEmbed()
			.setColor(profile.color || "#E7B2FF")
			.setThumbnail(bot.user.avatarURL);

		if(args.length<1)
			overview(bot, message, embed);
		else
			specific(bot, message, embed, args[0]);
	});
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
	usage: `${Settings.prefix}help`,
	hidden: false,
	category: "Help"
}