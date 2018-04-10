const botSettings = module.require("../botSettings.json");
const Discord = module.require("discord.js");
const actions = module.require("../actions.json");

const saeID = "329642253943570432";
const mID = "314206739639566346";

const cats = ["yuri", "yaoi", "straight"];

module.exports.run = async (bot, message, args, con) => {

	let member = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	args = args.splice(1);

	let gifs = actions.hugs;

	if(args.length > 0 && cats.includes(args[0].toLowerCase())) gifs = gifs[args[0].toLowerCase()];
	if(args.length === 0) gifs = gifs.yuri.concat(gifs.yaoi).concat(gifs.straight);

	let index = Math.floor(Math.random()*gifs.length);

	let gif = gifs[index];
	if(member.id === mID && message.author.id === saeID) gif = actions.hugs.yuri[16];


	con.query(`SELECT * FROM profiles WHERE UUID = '${message.author.id}';`, (err, rows) => {
		let profile = rows[0];
		
		let embed = new Discord.RichEmbed()
			.setAuthor(`${message.member.displayName} hugged ${member.displayName}`)
			.setImage(gif)
			.setColor(profile.color || "#E7B2FF");

		message.channel.send(embed);
	});
}

module.exports.help = {
	name: "hug",
	usage: "<hug <mention> [yuri, yaoi, or straight]",
	hidden: false,
	category: "Actions"
}