const fs = module.require("fs");
const botSettings = module.require("../botSettings.json");

module.exports.run = async (bot, message, args) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have the manage messages permission");

	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if(!toMute) return message.channel.send("You did not specify a user mention!");

	let muteTime = parseInt(args[1]);
	if(!muteTime) return message.channel.send("You did not specify a length of time!");


	if(toMute.id === message.author.id) return message.channel.send("You cannot mute yourself.");
	if(toMute.highestRole.position >= message.guild.member(message.author).highestRole.position) return message.channel.send("You cannot mute a member who is higher or has the same role as you.");

	if(toMute.hasPermission(['ADMINISTRATOR'])) return message.channel.send("You cannot mute an administrator.")

	let role = message.guild.roles.find(r => r.name === "Bot Mute");
	if(!role)
	{
		try{
			role = await message.guild.createRole({
				name: "Bot Mute",
				color: "#000000",
				permissions: []
			});

			message.guild.channels.forEach(async (channel, id) => {
				await channel.overwritePermissions(role, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false
				});
			});
		}catch(e){
			logger.error(e.stack);
		}
	}

	if(toMute.roles.has(role.id)) return message.channel.send("This user is already muted!");

	bot.mutes[toMute.id] = {
		guild: message.guild.id,
		time: Date.now() + parseInt(args[1]) * 1000,
		channel: message.channel.id
	};

	await toMute.addRole(role);

	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
		if(err) throw err;
		message.channel.send("I have muted this user.");
	});

	
	return;
}

module.exports.help = {
	name: "mute",
	usage: `${botSettings.prefix}mute <mention> <seconds>`,
	hidden: false,
	category: "Admin"
}