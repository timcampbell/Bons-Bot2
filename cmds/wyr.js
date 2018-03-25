const Discord = module.require("discord.js");
const snekFetch = module.require("snekFetch");
const botSettings = module.require("../botSettings.json");

const FILTERED_TAGS=['rape','gross','sex','circumcision']

module.exports.run = async(bot, message, args) => {

	let msg = await message.channel.send("Getting would you rather...");

	if(args.length <= 0)
		await sfw(message);
	else if(args[0] === `nsfw`)
		await nsfw(message);
	else
		message.channel.send(`Invalid argument provided`);

	msg.delete();

}

module.exports.help = {
	name: "wyr",
	usage: "<wyr [nsfw]",
	hidden: false,
	category: "Fun"
}

async function getWYR(){
	data = await snekFetch.get(`${botSettings.wyrURL}?nsfw=false`).then( r => {
		r=r.body;

		r['title']=r['title'].trim().trimRight('.?,:');
		r['choicea']=r['choicea'].trim().trimRight('.?,:').trimLeft('.');
		r['choiceb']=r['choiceb'].trim().trimRight('.?,:').trimLeft('.');

		if(r.tags){
			r.tags = r['tags'].toLowerCase().split(',');
		}
		else
			r.tags=[]

		return r;
	})	

	return data;
}

async function filtered(tags){
	isFiltered=false;

	for(i=0; i<tags.length; i++){
		if(tags[i] in FILTERED_TAGS){
			isFiltered=true;
			break
			;
		}
	}

	return isFiltered;
}

async function nsfw(message){
	var data;

	if(!(message.channel.nsfw))
		return message.channel.send("Must be a nsfw channel");

	while(true){
		data = await getWYR();

		if(!(data['nsfw']))
			continue;
		else
			break;

	}
	msg = `**${data.title}**\n:a: - ${data.choicea}\n:b: - ${data.choiceb}`

	question = await message.channel.send(msg)

	await question.react("🅰")
	await question.react("🅱")
}

async function sfw(message) {
	var data;

	while(true){
		data = await getWYR();

		if(data['nsfw'])
			continue;
		if( await filtered(data.tags))
			continue;
		else
			break;

	}
	msg = `**${data.title}**\n:a: - ${data.choicea}\n:b: - ${data.choiceb}`

	question = await message.channel.send(msg)

	await question.react("🅰")
	await question.react("🅱")
}
