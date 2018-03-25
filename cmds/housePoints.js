const Discord = module.require("discord.js");

module.exports.run = async(bot, message, args) => {
	let embed = new Discord.RichEmbed()
		.setColor("#9B59B6")
		.setThumbnail("https://i.pinimg.com/736x/0a/41/0e/0a410e3a4f03610eed0dbbbcd2f0a3db--book-tattoo-harry-potter-hogwarts.jpg");

	for(h in bot.housePoints){
		embed.addField(h, bot.housePoints[h]);
	}

	return message.channel.send(embed);
}

module.exports.help = {
	name: "housePoints",
	usage: "<housePoints",
	hidden: false,
	category: "Fun"
}