const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv/config');

const MessageResponder = require("./MessageResponder.js");
const Logger = require("./Logger.js");
const UserIDs = require("./IDs/UserIDs.js");
const GuildIDs = require("./IDs/GuildIDs.js");
const GuildChannelIDs = require("./IDs/GuildChannelIDs.js");


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
    Logger.logReady(client, c);
});

client.on(Events.MessageCreate, message => {
    if (message.author.id == UserIDs.sambot) {
        Logger.logResponse(message, "SB msg");
        if (message.content.indexOf("concept of zero") != -1) {
            message.reply({
                content: `omg shut up`,
                allowedMentions: { parse: [] },
            });
            Logger.logResponse(message, "SB 0")
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

const SAMBOT_STATUS_UPDATE_CHANNEL = "1149204443527663686";
const USER_IDS_TO_CHECK = [1139278863457857707, 508047929853083648];
client.on(Events.PresenceUpdate, (oldpresence, newpresence) => {
    let member = newpresence.member;
    // console.log(`${member.user.username} changed presence from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status} in ${member.guild}`);
    if (oldpresence != newpresence && client.channels.cache.get(SAMBOT_STATUS_UPDATE_CHANNEL).guildId == member.guild.id) {
        if (member.id == UserIDs.sambot) {
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