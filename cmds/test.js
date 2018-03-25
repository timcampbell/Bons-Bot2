const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {
	let member = message.mentions.users.first() || message.author;

	con.query(`SELECT n.Name FROM names n JOIN sisters s ON s.UUID = '${member.id}' WHERE n.UUID = s.SisterUUID`, (err, rows) => {
		if(err) throw err;

		var sis = '';

		for(r in rows)
		{
			sis+=`${rows[r].Name}\n`;
		}

		if(sis === '')
			sis = "You have no sisters"

		con.query(`SELECT n.Name FROM names n JOIN brothers b ON b.UUID = '${member.id}' WHERE n.UUID = b.BrotherUUID`, (err, rows)=>{
			if(err) throw err;

			var bro = '';

			for(r in rows)
			{
				bro+=`${rows[r].Name}\n`
			}


			if(bro === '')
				bro = "You have no brothers"

			let embed = new Discord.RichEmbed()
				.setAuthor(member.username)
				.setDescription("This is the user's info!")
				.setColor("#9B59B6")
				.setThumbnail(member.avatarURL)
				.addField("Full Username", `${member.username}#${member.discriminator}`)
				.addField("Sisters", sis, true)
				.addField("Brothers", bro, true)
				.addField("Hogwarts House", "Hufflepuff")
				.addField("ID", member.id)
				.addField("Created at", member.createdAt);

			message.channel.send(embed);
		})
	});

}

module.exports.help = {
	name: "test",
	usage: "<test",
	hidden: true,
	category: "Misc"
}