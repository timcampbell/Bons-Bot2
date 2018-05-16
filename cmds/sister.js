const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {
	let member = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);

	if(!member) return message.channel.send(`Please mention a user.`);

	if(member.id === message.author.id) return message.channel.send(`You cannot be your own sister.`);
	if(member.user.bot) return message.channel.send(`Bots cannot be your sisters.`);

	if(args.length <= 0)
		return message.channel.send(`No arguments provided`);

	if(args[0] === `add`)
		await add(message, member.id, con);

	if(args[0] === `del`)
		await del(message, member.id, con);	
}

async function add(message, sister, con){

	let sql = `SELECT * FROM sisters s WHERE s.UUID='${message.author.id}' AND s.SisterUUID='${sister}'`;

	con.query(sql, (err,rows)=>{
		if(err) throw err;

		if(rows.length < 1)
		{
			con.query(`INSERT INTO sisters (UUID, SisterUUID) VALUES ('${message.author.id}','${sister}')`, (err, rows)=>{ return; });
			return message.channel.send(`This user is now your sister.`);
		}
		else
			return message.channel.send(`This user is already your sister`);
	});
}

async function del(message, sister, con){

	let sql = `SELECT * FROM sisters s WHERE s.UUID='${message.author.id}' AND s.SisterUUID='${sister}'`;

	con.query(sql, (err,rows)=>{
		if(err) throw err;

		if(rows.length < 1)
			return message.channel.send(`This user is not your sister`);
		else
		{
			con.query(`DELETE FROM sisters WHERE UUID='${message.author.id}' AND SisterUUID='${sister}'`, (err, rows)=>{ return; });
			return message.channel.send(`This user is no longer your sister.`);
		}
	});
}

module.exports.help = {
	name: "sister",
	usage: `${botSettings.prefix}sister <add|del> <mention>`,
	hidden: false,
	category: "Relations"
}