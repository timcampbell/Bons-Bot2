const fs = module.require("fs");

module.exports.run = async(bot, message, args) => {

	if(args.length <= 0) return message.channel.send("Please specify a color in Hex code.(Eg. #4563fa)");
		

	bot.profiles[message.author.id].color = args[0];

	fs.writeFile("./users.json", JSON.stringify(bot.profiles, null, 4), err => {
		if(err) throw err;
	})

	return message.channel.send(`${message.author.username}'s color has been set to ${bot.profiles[message.author.id].color}`);
}

module.exports.help = {
	"name": "setColor",
	"usage": "<setColor <hexCode>",
	hidden: false,
	category: "Misc"
}