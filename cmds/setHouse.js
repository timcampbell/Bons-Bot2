const fs = module.require("fs");
const houses = ["gryffindor", "hufflepuff", "ravenclaw", "slytherin"];
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {

	if(args.length <= 0) return message.channel.send("Please specify a house.");

	let house = args[0].toLowerCase()
	if(!houses.includes(house)) return message.channel.send("That is not a valid house.");

	con.query(`UPDATE profiles SET house="${house.charAt(0).toUpperCase()}${house.slice(1)}" WHERE UUID="${message.author.id}";`, (err, rows) => {
		con.query(`SELECT house FROM profiles WHERE UUID = "${message.author.id}";`, (err, rows) => {
			return message.channel.send(`${message.author.username}'s house has been set to ${rows[0].house}`);
		})
	});
}

module.exports.help = {
	"name": "setHouse",
	"usage": `${botSettings.prefix}setHouse <House>`,
	hidden: false,
	category: "Fun"
}