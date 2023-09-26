const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv/config');
// const tess = require("./MessageResponder.js");
const MessageResponder = require("./MessageResponder.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
});

// client.on('ready', () => {
    
//     console.log('The bot is ready');
// });

client.on(Events.ClientReady, c => {
	console.log(`\nReady! Logged in as ${c.user.tag} in the following servers:`);
    client.guilds.cache.forEach((guild, key, map) => {
        console.log(`${guild.id}\t${guild.name}`);
    });
    console.log("---------------------------------------------------------------");
});

client.on('messageCreate', message => {
    if (message.author.id == "1139278863457857707") {
        console.log(`sambot said something\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`)
        if (message.content.indexOf("concept of zero") != -1) {
            message.reply({
                content: `omg shut up`,
                allowedMentions: { parse: [] },
            });
            console.log(`concept 0\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`);
        }
    }

    if (!message.author.bot) {
        MessageResponder.pingpong(message);
        MessageResponder.tess(message);
        MessageResponder.cool(message);
        MessageResponder.sambot(message);
        MessageResponder.im(message);
    }
});

const SAMBOT_ID = 1139278863457857707;
const SAMBOT_STATUS_UPDATE_CHANNEL = "1149204443527663686";
const USER_IDS_TO_CHECK = [1139278863457857707, 508047929853083648];
client.on(Events.PresenceUpdate, (oldpresence, newpresence) => {
    let member = newpresence.member;
    // console.log(`${member.user.username} changed presence from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status} in ${member.guild}`);
    if (oldpresence != newpresence && client.channels.cache.get(SAMBOT_STATUS_UPDATE_CHANNEL).guildId == member.guild.id) {
        if (member.id == SAMBOT_ID) {
            console.log("sambot changed it!!!!!!");
            if (newpresence.status == "offline") {
                console.log("sambot went offline");
                client.channels.cache.get(SAMBOT_STATUS_UPDATE_CHANNEL).send("sambot went offline/invisible!!!!");
            } else if (newpresence.status == "online") {
                console.log("sambot went online");
                client.channels.cache.get(SAMBOT_STATUS_UPDATE_CHANNEL).send("sambot went online!!!!");
            }
        } // else if (member.id == 508047929853083648) { // srikar joke code
        //     console.log(`${member.user.username} changed presence from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status} in ${member.guild}`);
        //     client.channels.cache.get(SAMBOT_STATUS_UPDATE_CHANNEL).send(`${member.user.username} changed from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status}`);
        // }
        

    }
});



client.login(process.env.TOKEN);

