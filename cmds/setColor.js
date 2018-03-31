const fs = module.require("fs");

module.exports.run = async(bot, message, args, con) => {

	if(args.length <= 0 || args.length > 6) return message.channel.send("Please specify a color in Hex code.(Eg. 4563fa)");
		
	con.query(`UPDATE profiles SET color="${args[0]}" WHERE UUID="${message.author.id}";`, (err, rows) => {
		con.query(`SELECT color FROM profiles WHERE UUID = "${message.author.id}";`, (err, rows) => {
			return message.channel.send(`${message.author.username}'s color has been set to #${rows[0].color}`);
		})
	});

	// bot.profiles[message.author.id].color = args[0];

	// fs.writeFile("./users.json", JSON.stringify(bot.profiles, null, 4), err => {
	// 	if(err) throw err;
	// })

}

module.exports.help = {
	"name": "setColor",
	"usage": "<setColor <hexCode>",
	hidden: false,
	category: "Misc"
}