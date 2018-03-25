const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args) => {
	if(args.length <= 0) return message.channel.send("Please enter search terms");

	let search="";
	for(i in args){
		search = `${search}+${args[i]}`;
	}

	snekFetch.get(`${botSettings.musicURL}?method=track.search&track=${search.slice(1)}&api_key=${botSettings.musicAPI}&format=json`).then( r => {
		let tracks = r.body.results.trackmatches.track;

		let track = (tracks[Math.floor(Math.random()*tracks.length)]);

		let embed = new Discord.RichEmbed()
			.setColor("#E7B2FF")
			.setAuthor(track.name)
			.setDescription(`By: ${track.artist}`)
			.setThumbnail(track.image[track.image.length-1]['#text'])
			.addField("Link", track.url);
		return message.channel.send(embed);
	});
}

module.exports.help = {
	name: "music",
	usage: "<music <searchTerms>",
	hidden: false,
	category: "Music"
}