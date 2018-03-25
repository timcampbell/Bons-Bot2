const fs = module.require("fs");
const houses = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];

module.exports.run = async(bot, message, args) => {

	if(args.length <= 0) return message.channel.send("Please specify a house.");

	let house = args[0].toLowerCase()
	if(!houses.includes(house)) return message.channel.send("That is not a valid house.");
		

	bot.profiles[message.author.id].house = `${house.charAt(0).toUpperCase()}${house.slice(1)}`;

	fs.writeFile("./users.json", JSON.stringify(bot.profiles, null, 4), err => {
		if(err) throw err;
	})

	return message.channel.send(`${message.author.username}'s house has been set to ${bot.profiles[message.author.id].house}`);
}

module.exports.help = {
	"name": "setHouse",
	"usage": "<setHouse <House>",
	hidden: false,
	category: "Fun"
}