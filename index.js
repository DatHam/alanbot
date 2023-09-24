const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
});

const TESSES = ['ess', 'est'];
const TICKLE = ' tickles very tasty';


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
    if (!message.author.bot) {
        // pingpong
        if (message.content === 'ping') {
            message.reply('pong');
            console.log(`pingpong\t${message.guild.name}\t\t\t${message.channel.name}\t\t\t${message.author.username}\t\t\t${message.createdAt.toString()}`);
        }

        // tesses
        let indexOfLastTessInMessage = -1;
        let indexOfLastTessInArray = -1;
        for (let i = 0; i < TESSES.length; i++) {
            let lastIndex = message.content.toLowerCase().lastIndexOf(TESSES[i]);
            if (lastIndex + TESSES[i].length + TICKLE.length >= 2000) { // checks if message is too long
                message.reply({
                    content: `nice try but i fixed it`,
                    allowedMentions: { parse: [] },
                })
            } else if (lastIndex > indexOfLastTessInMessage) {
                indexOfLastTessInMessage = lastIndex;
                indexOfLastTessInArray = i;
            }
        }
        if (indexOfLastTessInMessage != -1) {
            message.reply({
                content: `${message.content.substring(0, indexOfLastTessInMessage + TESSES[indexOfLastTessInArray].length)}${TICKLE}`,
                allowedMentions: { parse: [] },
            });
            console.log(`t:${TESSES[indexOfLastTessInArray]}\t\t${message.guild.name}\t\t\t${message.channel.name}\t\t\t${message.author.username}\t\t\t${message.createdAt.toString()}`);
        }

        // eens/eans
        if (message.content.toLowerCase().indexOf('eens') != -1 || message.content.toLowerCase().indexOf('eans') != -1) {
            message.reply({
                content: `cool ${message.content.substring(0, Math.max(message.content.toLowerCase().lastIndexOf('eens'), message.content.toLowerCase().lastIndexOf('eans')) + 4)}`,
                allowedMentions: { parse: [] },
            });
            console.log(`eens/eans\t${message.guild.name}\t\t\t${message.channel.name}\t\t\t${message.author.username}\t\t\t${message.createdAt.toString()}`);
        }

        // sam>alan
        if (message.content.toLowerCase().indexOf('sambot') != -1) {
            message.reply({
                content: `${message.content.substring(0, message.content.toLowerCase().lastIndexOf('sambot') + 6)} > alanbot`,
                allowedMentions: { parse: [] },
            });
            console.log(`sam>alan\t${message.guild.name}\t\t\t${message.channel.name}\t\t\t${message.author.username}\t\t\t${message.createdAt.toString()}`);
        }
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

