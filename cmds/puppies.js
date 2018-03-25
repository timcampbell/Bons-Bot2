const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args) => {
	snekFetch.get(`${botSettings.unsplashURL}?client_id=${botSettings.unsplashID}&query=puppies`).then( r => {
		let url = r.body.urls.raw;
		let userProfile = r.body.user.links.html;
		let user = r.body.user.name;

		let embed = new Discord.RichEmbed()
			.setColor("#E7B2FF")
			.setImage(url)
			.setAuthor(user)
			.setDescription(userProfile+botSettings.unsplashUTM)
			.setFooter("Picture provided by: unsplash.com")
		return message.channel.send(embed);
	});
}

module.exports.help = {
	name: "puppies",
	usage: "<puppies",
	hidden: false,
	category: "Images"
}