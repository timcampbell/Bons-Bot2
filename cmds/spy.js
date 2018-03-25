const botSettings = module.require("../botSettings.json");
const location = module.require("../spyLocations.json");

var games=[];

module.exports.run = async(bot, message, args) => {
	if(args.length <= 0)
		return message.channel.send(`No arguments provided`);

	if(args[0] === `ready`)
		await ready(message.author, message);

	if(args[0] === `join`)
		await join(message.author, message);

	if(args[0] === `start`)
		await start(message);

	if(args[0] === `end`)
		await end(message);

	if(args[0] === `leave`)
		await leave(message);

	if(args[0] === `locations`)
		await locations(message);

	if(args[0] === `time`)
		await time(message, args);
}

module.exports.help = {
	name: "spy",
	usage: "<spy <ready|join|leave|start|end|locations|time x>",
	hidden: false,
	category: "Fun"
}

module.exports.checkTime = async() => {
	for(g in games){
		if(Date.now() >= games[g].time && games[g].spyGameStarted && !games[g].timeOver){
			games[g].timeOver=true;
			games[g].channel.send(`Time Over`);
		}
	}
}

async function ready(member, message){
	

	if(games[message.guild.id])
		return message.channel.send(`Game was already created`);

	games[message.guild.id]={
		"spyGameStarted": false,
		"players":[],
		"location": location.Locations[Math.floor(Math.random()*location.Locations.length)],
		"playerCount": 0,
		"channel": message.channel,
		"time": null,
		"timeOver": false
	}

	games[message.guild.id].time = (10*60000)

	games[message.guild.id].players[member.id]={
		"dm": await member.createDM(),
		"name": member.username,
		"spy": false,
		"GM": true
	}

	games[message.guild.id].playerCount++;

	message.channel.send(`Use "${botSettings.prefix}spy start" when all players have joined\n"${botSettings.prefix}spy join" to join the game\n"${botSettings.prefix}spy time x" to change time limit where x is number of minutes(default: 10)`);
}

async function join(member, message){
	if(!games[message.guild.id])
		return message.channel.send(`No game to join\nPlease use "${botSettings.prefix}spy ready" to create a game`)

	if(games[message.guild.id].spyGameStarted)
		return message.channel.send(`Game has already started`);

	if(games[message.guild.id].players[member.id])
		return member.lastMessage.channel.send(`You are already joined`);

	games[message.guild.id].players[member.id]={
		"dm": await member.createDM(),
		"name": member.username,
		"spy": false,
		"GM": false
	}

	games[message.guild.id].playerCount++;

	return message.channel.send(`You have joined the game`);
}

async function start(message){
	if(!games[message.guild.id])
		return message.channel.send(`No game to start`)

	if(!games[message.guild.id].players[message.author.id].GM)
		return message.channel.send(`Only the player who created the game can start it`);

	if(games[message.guild.id].playerCount < 3)
		return message.channel.send(`Need a minimum of 3 players`);

	var spyIndex = await getIndex(games[message.guild.id].playerCount);

	for(p in games[message.guild.id].players){

		if(spyIndex <= 0)
		{
			games[message.guild.id].players[p].spy=true;
			games[message.guild.id].players[p].dm.send(`You are the spy`);
			break;
		}

		spyIndex--;
	}

	for(p in games[message.guild.id].players){
		if(!games[message.guild.id].players[p].spy)
			games[message.guild.id].players[p].dm.send(`The location is ${games[message.guild.id].location}`);
	}

	games[message.guild.id].spyGameStarted=true;

	games[message.guild.id].time = games[message.guild.id].time+Date.now()
}

async function end(message){
	if(!games[message.guild.id])
		return message.channel.send(`No game to end`);
	if(!games[message.guild.id].players[message.author.id].GM)
		return message.channel.send(`Only the player who created the game can end it`);
	if(!games[message.guild.id].spyGameStarted){
		games= await deleteElement(games, message.guild.id);
		return message.channel.send(`Game was cancelled`);
	}

	var spy;
	for(p in games[message.guild.id].players){
		if(games[message.guild.id].players[p].spy){
			spy=p;
			break;
		}
	}

	loc=games[message.guild.id].location;

	games= await deleteElement(games, message.guild.id);

	return message.channel.send(`<@${spy}> was the spy\n${loc} was the location`);
}

async function leave(message){
	if(!games[message.guild.id].players[message.author.id])
		return message.channel.send(`You are not in this game`);
	if(games[message.guild.id].spyGameStarted)
		return message.channel.send(`You can't leave a game that has been started`);
	if(games[message.guild.id].players[message.author.id].GM){
		games = deleteElement(games, message.guild.id);
		return message.channel.send(`Game was deleted since creator left`)
	}

	games[message.guild.id].players = await deleteElement(games[message.guild.id].players, message.author.id);

	return message.channel.send(`You have left the game`);
}

async function locations(message){
	msg="```"
	
	for(l in location.Locations)
		msg+=`${location.Locations[l]}\n`

	msg+="```"
	return message.channel.send(msg);
}

async function time(message, args){
	if(!games[message.guild.id])
		return message.channel.send(`Please create a game first`);

	if(args.length <= 1)
		return message.channel.send(`No time provided`);

	let time=parseInt(args[1])
	if(!time)
		return message.channel.send(`Invalid time entered`);
	if(time < 5)
		return message.channel.send(`Time must be at least 5 minutes`)

	games[message.guild.id].time=time*60000;

	return message.channel.send(`Time limit set to ${time} minutes`);
}


async function deleteElement(array, elementId){
	var newArray=[];

	for(e in array){
		if(e != elementId)
			newArray[e]=array[e]
	}

	return newArray;
}

async function getIndex(num){
	var spyIndex = Math.random()*num;
	var randomLoop = Math.ceil(Math.random()*(num*10)+num);

	for(var i = 0; i<randomLoop; i++)
	{
		spyIndex = Math.random() * num;
	}

	return Math.floor(spyIndex);
}