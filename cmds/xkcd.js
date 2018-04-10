const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

let profile;

module.exports.run = async(bot, message, args, con) => {
	let index;

	if(args.length >= 1)
		index = args[0];
	else
	{
		let temp = await snekFetch.get(`${botSettings.xkcdURL}/info.0.json`);
		index = Math.ceil(Math.random()*temp.body.num);
	}

	let r = await snekFetch.get(`${botSettings.xkcdURL}/${index}/info.0.json`);

	let test = r.body.img;

	console.log(profile);		

	await con.query(`SELECT * FROM profiles WHERE UUID = '${message.author.id}';`, (err, rows) => {
		profile = rows[0];
		
		let embed = new Discord.RichEmbed()
			.setTitle(`${index}: ${r.body.safe_title}`)
			.setURL(`${botSettings.xkcdURL}/${index}/`)
			.setColor(profile.color || "#E7B2FF")
			.setImage(r.body.img)
			.setFooter(r.body.alt);
		return message.channel.send(embed);
	});
}

module.exports.help = {
	name: "xkcd",
	usage: "<xkcd [num]",
	hidden: true,
	category: "Images"
}