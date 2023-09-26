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
const IMS = ["im", "i'm", "i am"];


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

        let messageLowercase = message.content.toLowerCase();

        // pingpong
        if (message.content === 'ping') {
            message.reply('pong');
            console.log(`pingpong\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`);
        }

        // tesses
        let indexOfLastTessInMessage = -1;
        let indexOfLastTessInArray = -1;
        for (let i = 0; i < TESSES.length; i++) {
            let lastIndex = messageLowercase.lastIndexOf(TESSES[i]);
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
            console.log(`t:${TESSES[indexOfLastTessInArray]}\t\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`);
        }

        // eens/eans
        if (messageLowercase.indexOf('eens') != -1 || messageLowercase.indexOf('eans') != -1) {
            message.reply({
                content: `cool ${message.content.substring(0, Math.max(messageLowercase.lastIndexOf('eens'), messageLowercase.lastIndexOf('eans')) + 4)}`,
                allowedMentions: { parse: [] },
            });
            console.log(`eens/eans\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`);
        }

        // sam>alan
        if (messageLowercase.indexOf('sambot') != -1) {
            message.reply({
                content: `${message.content.substring(0, messageLowercase.lastIndexOf('sambot') + 6)} > alanbot`,
                allowedMentions: { parse: [] },
            });
            console.log(`sam>alan\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`);
        }

        // im
        if (messageLowercase.indexOf("im") != -1 || messageLowercase.indexOf("i'm") != -1) {
            let indexIm = messageLowercase.indexOf("im");
            let indexIam = messageLowercase.indexOf("i'm");
            let startIndex = -1;
            if (indexIam == -1 || (indexIm != -1 && indexIm < indexIam)) {
                startIndex = indexIm + 2;
                if (messageLowercase.charAt(startIndex) == ' ') {
                    startIndex++;
                }
            } else {
                startIndex = indexIam + 3;
                if (messageLowercase.charAt(startIndex) == ' ') {
                    startIndex++;
                }
            }

            message.reply({
                content: `hi ${message.content.substring(startIndex)}`,
                allowedMentions: { parse: [] },
            });
            console.log(`im\t\t${message.guild.name}\t\t${message.channel.name}\t\t${message.author.username}\t\t${message.createdAt.toString()}`);
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

