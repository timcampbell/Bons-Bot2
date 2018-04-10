const Discord = module.require("discord.js");

var house;
var color;
var sis;

var sisSQL;
var broSQL;

var member;
var channel;


module.exports.run = async (bot, message, args, con) => {
	member = message.mentions.users.first() || message.author;

	if(member.bot) {
		message.channel.send("It's a robot.  What more do you need to know?");
		return;
	}

	sisSQL = `SELECT n.Name FROM profiles n JOIN sisters s ON s.UUID = '${member.id}' WHERE n.UUID = s.SisterUUID`;
	broSQL = `SELECT n.Name FROM profiles n JOIN brothers b ON b.UUID = '${member.id}' WHERE n.UUID = b.BrotherUUID`;

	channel = message.channel;

	getProfile(con);
}

function getProfile(con) {
	con.query(`SELECT * FROM profiles WHERE UUID = "${member.id}";`, (err,rows) =>{
		processProfile(rows[0], con);
	});
}

function processProfile(profile, con){
	house = profile.house || "No house set";
	color = profile.color || "#E7B2FF";

	con.query(sisSQL, (err,rows) => {
		if(err) throw err;
		processSis(rows, con);
	});
}

function processSis(rows, con){
	sis = '';

	for(r in rows){
		sis+=`${rows[r].Name}\n`;
	}

	if(rows.length < 1)
		sis = `You have no sisters.`;

	con.query(broSQL, (err, rows)=>{
		if(err) throw err;
		processBro(rows, con);
	});
}

function processBro(rows, con){
	bro = '';

	for(r in rows){
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

	channel.send(embed);
}

module.exports.help = {
	name: "userinfo",
	usage: "<userinfo [mention]",
	hidden: false,
	category: "Misc"
}