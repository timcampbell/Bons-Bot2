const fs = module.require("fs");
const botSettings = module.require("../botSettings.json");

module.exports.run = async(bot, message, args, con) => {

	if(args.length <= 0 || args.length > 6) return message.channel.send("Please specify a color in Hex code.(Eg. 4563fa)");
		
	con.query(`UPDATE profiles SET color="${args[0]}" WHERE UUID="${message.author.id}";`, (err, rows) => {
		con.query(`SELECT color FROM profiles WHERE UUID = "${message.author.id}";`, (err, rows) => {
			return message.channel.send(`${message.author.username}'s color has been set to #${rows[0].color}`);
		})
	});

}

module.exports.help = {
	"name": "setColor",
	"usage": `${botSettings.prefix}setColor <hexCode>`,
	hidden: false,
	category: "Misc"
}