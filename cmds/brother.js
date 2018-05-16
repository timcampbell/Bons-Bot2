const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {
	let member = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[1]);

	if(!member) return message.channel.send(`Please mention a user.`);

	if(member.id === message.author.id) return message.channel.send(`You cannot be your own brother.`);
	if(member.user.bot) return message.channel.send(`Bots cannot be your brothers.`);

	if(args.length <= 0)
		return message.channel.send(`No arguments provided`);

	if(args[0] === `add`)
		await add(message, member.id, con);

	if(args[0] === `del`)
		await del(message, member.id, con);	
}

async function add(message, brother, con){

	let sql = `SELECT * FROM brothers b WHERE b.UUID='${message.author.id}' AND b.BrotherUUID='${brother}'`;

	con.query(sql, (err,rows)=>{
		if(err) throw err;

		if(rows.length < 1)
		{
			con.query(`INSERT INTO brothers (UUID, BrotherUUID) VALUES ('${message.author.id}','${brother}')`, (err, rows)=>{ return; });
			return message.channel.send(`This user is now your brother.`);
		}
		else
			return message.channel.send(`This user is already your brother`);
	});
}

async function del(message, brother, con){

	let sql = `SELECT * FROM brothers b WHERE b.UUID='${message.author.id}' AND b.BrotherUUID='${brother}'`;

	con.query(sql, (err,rows)=>{
		if(err) throw err;

		if(rows.length < 1)
			return message.channel.send(`This user is not your brother`);
		else
		{
			con.query(`DELETE FROM brothers WHERE UUID='${message.author.id}' AND BrotherUUID='${brother}'`, (err, rows)=>{ return; })
			return message.channel.send(`This user is no longer your brother.`);
		}
	});
}

module.exports.help = {
	name: "brother",
	usage: `${botSettings.prefix}brother <add|del> <mention>`,
	hidden: false,
	category: "Relations"
}