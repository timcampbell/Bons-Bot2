const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args, con) => {
	let member = message.mentions.users.first() || message.author;

	if(member.bot) {
		message.channel.send("It's a robot.  What more do you need to know?");
		return;
	}

	let house = bot.profiles[member.id].house || "No house set";
	let color = bot.profiles[member.id].color || "#9B59B6";
	
	let sisSQL = `SELECT n.Name FROM names n JOIN sisters s ON s.UUID = '${member.id}' WHERE n.UUID = s.SisterUUID`;
	let broSQL = `SELECT n.Name FROM names n JOIN brothers b ON b.UUID = '${member.id}' WHERE n.UUID = b.BrotherUUID`;

	con.query(sisSQL, (err, rows) => {
		if(err) throw err;

		var sis = '';

		for(r in rows){
			sis+=`${rows[r].Name}\n`;
		}

		if(rows.length < 1)
			sis = `You have no sisters.`;

		con.query(broSQL, (err, rows)=>{
			if(err) throw err;

			var bro = '';

			for(r in rows)
			{
				bro+=`${rows[r].Name}\n`;
			}

			if(rows.length<1)
				bro = `You have no brothers.`;


			let embed = new Discord.RichEmbed()
				.setAuthor(member.username)
				.setDescription("This is the user's info!")
				.setColor(color)
				.setThumbnail(member.avatarURL)
				.addField("Full Username", `${member.username}#${member.discriminator}`)
				.addField("Sisters", sis, true)
				.addField("Brothers", bro, true)
				.addField("Hogwarts House", house)
				.addField("ID", member.id)
				.addField("Created at", member.createdAt);

			message.channel.send(embed);
		});
	});
}

module.exports.help = {
	name: "userinfo",
	usage: "<userinfo [mention]",
	hidden: false,
	category: "Misc"
}