const botSettings = require("./botSettings.json");
const Discord = require("discord.js");
const logger = require("winston");
const fs = require("fs");
const sql = require("mysql");

const prefix = botSettings.prefix;


logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");

fs.readdir("./cmds/", (err, files) => {
	if(err) logger.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0)
	{
		logger.info("No commands to load!");
		return;
	}

	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		logger.info(`${i+1}: ${f} loaded`);
		bot.commands.set(props.help.name, props);
	});
})


bot.login(botSettings.token);

var con = sql.createConnection({
	host: "localhost",
	user: botSettings.dbUser,
	password: botSettings.dbPassword,
	database: "botdb",
	charset: "utf8mb4"
});

con.connect(err => {
	if(err) throw err;
	logger.info("Connected to Database");
});

bot.on("ready", async () => {
	logger.info('Connected');
	logger.info('Logged in as:');
	logger.info(bot.user.username + '(' + bot.user.id + ')');

	bot.generateInvite(['SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'VIEW_CHANNEL', 'MANAGE_ROLES']).then(link => {logger.info(link)})

	bot.guilds.forEach( async(guild, gid) => {
		guild.members.forEach( async(member, memid) => {

			if(member.user.bot) return;

			con.query(`SELECT * FROM profiles WHERE UUID='${memid}'`, (err, rows)=>{
				if(err) throw err;

				name = member.user.username;

				name = name.split(`'`).join(`\\'`);

				if(rows.length<1)
					con.query(`INSERT INTO profiles (UUID, Name) VALUES ('${memid}','${name}')`);
			});
		});
	})

	bot.setInterval(() => {
		bot.commands.get("spy").checkTime();
		for(let i in bot.mutes) {
			let time = bot.mutes[i].time;
			let guildID = bot.mutes[i].guild;
			let guild = bot.guilds.get(guildID);
			if(!guild) continue;
			let member = guild.members.get(i);
			let mutedRole = guild.roles.find(r => r.name === "Bot Mute");
			if(!mutedRole) continue;
			let channelID = bot.mutes[i].channel;
			let channel = guild.channels.get(channelID);

			if(Date.now() > time) {
				member.removeRole(mutedRole);
				delete bot.mutes[i];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
					if(err) throw err;
					channel.send(`<@${i}> has been unmuted`);

				});
			}
		}
	}, 1000);

	setInterval(function () {
		con.query('SELECT 1');
	}, 5000);

});

bot.on("guildMemberAdd", async(member) => {
		
	if(member.user.bot) return logger.info(`${member.displayName} was skipped because they were a bot`);

	con.query(`SELECT * FROM profiles WHERE UUID='${member.id}'`, (err, rows)=>{
		if(err) throw err;

		if(rows.length<1)
			con.query(`INSERT INTO profiles (UUID, Name) VALUES ('${member.id}','${member.user.username}')`);
	});
});

bot.on("guildMemberRemove", async(member) => {
	let toRemove = true;


	con.query(`SELECT * FROM profiles WHERE UUID="${member.id}"`, (err, rows) => {
		
		if(rows.length<1) return;

		bot.guilds.forEach(async(guild, id) => {
			if(guild.members.has(member)) toRemove = false;
			if(!toRemove) return;
		});

		if(toRemove) delete con.query(`DELETE FROM profiles WHERE UUID="${member.id}"`, (err, rows) => {
			if(err) throw err;
		});
	});
});

bot.on("message", async message => {

	if(message.author.bot) 
	{
		pokePingCheck(message);
		return;
	};
	if(message.channel.type === 'dm') return;

	let messageArray = message.content.split(" ");
	let command = messageArray[0];
	let args = messageArray.slice(1);
	
	if(!command.startsWith(prefix)) return;

	let cmd = bot.commands.get(command.slice(prefix.length));
	if(cmd) cmd.run(bot, message, args, con);
	if(command.slice(prefix.length) === "hug") addPoints(bot, message.author);
});

function addPoints(bot, member) {
	con.query(`SELECT h.* FROM houses h JOIN profiles p ON UUID="${member.id}" WHERE p.house = h.name;`, (err, rows) => {
		if(err) throw err;

		if(rows.length<=0) return;

		house = rows[0].name;
		points = rows[0].points;

		con.query(`UPDATE houses SET points = ${++points} WHERE name = "${house}"`, (err, rows) => {
			if(err) throw err;
		})

		return;
	})
}

function pokePingCheck(message){
	let pokeRole = message.guild.roles.find('name', 'PokePing');
	let firstEmbed = message.embeds[0];

	if(!pokeRole) return;
	else if(pokeRole.members.size <= 0) return;
	if(message.author.id != botSettings.pokecordID) return;
	if(!firstEmbed) return;
	else if(!firstEmbed.title) return;
	else if(!firstEmbed.title.startsWith(`A wild`)) return;

	return message.channel.send(`${pokeRole} a new pokemon has appeared`);
}