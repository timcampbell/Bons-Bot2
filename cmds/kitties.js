const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {
	let r = await snekFetch.get(`${botSettings.unsplashURL}?client_id=${botSettings.unsplashID}&query=kittens`);


	con.query(`SELECT * FROM profiles WHERE UUID='${message.author.id}';`, (err, rows) => {
		let profile = rows[0];

		let embed = new Discord.RichEmbed()
			.setColor(profile.color || "#E7B2FF")
			.setImage(r.body.urls.raw)
			.setAuthor(r.body.user.name)
			.setDescription(r.body.user.links.html+botSettings.unsplashUTM)
			.setFooter("Picture provided by: unsplash.com")
		return message.channel.send(embed);
	});
}

module.exports.help = {
	name: "kitties",
	usage: "<kitties",
	hidden: false,
	category: "Images"
}