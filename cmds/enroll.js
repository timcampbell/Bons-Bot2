const fs = module.require("fs");
const botSettings = module.require("../botSettings.json");

module.exports.run = async (bot, message, args) => {

	let member = message.guild.member(message.author);

	let role = message.guild.roles.find(r => r.name === "PokePing");
	if(!role)
	{
		try{
			role = await message.guild.createRole({
				name: "PokePing",
				color: "#000000",
				mentionable: true
			});
		}catch(e){
			logger.error(e.stack);
		}
	}

	if(member.roles.has(role.id)) 
	{
		member.removeRole(role);
		return message.channel.send(`You are no longer a trainer`);
	}

	
	member.addRole(role);
	return message.channel.send(`You are now a trainer`);
}

module.exports.help = {
	name: "enroll",
	usage: `${botSettings.prefix}enroll`,
	hidden: false,
	category: "Misc"
}