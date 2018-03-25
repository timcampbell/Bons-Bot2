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
bot.profiles = require("./users.json");
bot.housePoints = require("./housePoints.json");

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

			con.query(`SELECT * FROM names WHERE UUID='${memid}'`, (err, rows)=>{
				if(err) throw err;

				name = member.user.username;

				name = name.split(`'`).join(`\\'`);

				if(rows.length<1)
					con.query(`INSERT INTO names (UUID, Name) VALUES ('${memid}','${name}')`);
			});

			if(bot.profiles[memid]) return;
	
			bot.profiles[memid] = {
				house: null,
				color: null
			};
		});
	})

	fs.writeFile("./users.json", JSON.stringify(bot.profiles, null, 4), err => {
					if(err) throw err;
				});

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
	if(bot.profiles[member.id]) return logger.info(`${member.displayName} was skipped because they are already saved`);
		
	if(member.user.bot) return logger.info(`${member.displayName} was skipped because they were a bot`);

	bot.profiles[member.id] = {
		house: null,
		color: null
	};

	con.query(`SELECT * FROM names WHERE UUID='${member.id}'`, (err, rows)=>{
		if(err) throw err;

		if(rows.length<1)
			con.query(`INSERT INTO names (UUID, Name) VALUES ('${memid}','${member.user.username}')`);
	});

	fs.writeFile("./users.json", JSON.stringify(bot.profiles, null, 4), err => {
					if(err) throw err;
					logger.info(`${member.displayName} has been added`);
				});
});

bot.on("guildMemberRemove", async(member) => {
	let toRemove = true;

	if(!bot.profiles[member.id]) return;

	bot.guilds.forEach(async(guild, id) => {
		if(guild.members.has(member)) toRemove = false;
		if(!toRemove) return;
	});

	if(toRemove) delete bot.profiles[member.id];

	fs.writeFile("./users.json", JSON.stringify(bot.profiles, null, 4), err => {
				if(err) throw err;
				logger.info(`${member.displayName} was removed`);
			});
});

bot.on("message", async message => {

	if(message.author.bot) return;
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
	if(!bot.profiles[member.id].house) return;

	fs.writeFile("./housePoints.json", JSON.stringify(bot.housePoints, null, 4), err => {
					if(err) throw err;
				});

	return ++bot.housePoints[bot.profiles[member.id].house];
}