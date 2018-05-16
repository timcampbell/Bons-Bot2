const Discord = module.require("discord.js");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {

	con.query(`SELECT * FROM profiles WHERE UUID = '${message.author.id}';`, (err, rows) => {
		let profile = rows[0];

		let embed = new Discord.RichEmbed()
			.setColor(profile.color || "#E7B2FF")
			.setThumbnail("https://i.pinimg.com/736x/0a/41/0e/0a410e3a4f03610eed0dbbbcd2f0a3db--book-tattoo-harry-potter-hogwarts.jpg");

		con.query(`SELECT * FROM houses ORDER BY points DESC;`, (err, rows) => {
			for(r in rows){
				embed.addField(rows[r].name, rows[r].points);
			}

			return message.channel.send(embed);
		});
	});
}

module.exports.help = {
	name: "housePoints",
	usage: `${botSettings.prefix}housePoints`,
	hidden: false,
	category: "Fun"
}