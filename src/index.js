const { Client, GatewayIntentBits, Events, MessageType, userMention } = require('discord.js');
require('dotenv/config');

const MessageResponder = require("./MessageResponder.js");
const Logger = require("./Logger.js");
const PresenceLogger = require("./PresenceLogger.js");

const USER_IDS = require("./IDS/USER_IDS.js");
const GUILD_IDS = require("./IDS/GUILD_IDS.js");
const GUILD_CHANNEL_IDS = require("./IDS/GUILD_CHANNEL_IDS.js");

const IAN_GUILDS = new Set();
IAN_GUILDS.add(GUILD_IDS.EGGLESSBONKER);
IAN_GUILDS.add(GUILD_IDS.GEOGUSSRY);
IAN_GUILDS.add(GUILD_IDS.JHS_ORCHESTRA);
IAN_GUILDS.add(GUILD_IDS.TEST_SERVER);


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
});

const NUM_ERRORS_BEFORE_CRASHING = 10;
let numErrorsThisSession = 0;
process.on('unhandledRejection', error => {
    numErrorsThisSession++;
    Logger.logUnhandledPromiseRejectionToFile(error, client, numErrorsThisSession);
    if (numErrorsThisSession >= NUM_ERRORS_BEFORE_CRASHING) {
        throw error;
    }
});

// const { getVoiceConnection } = require('@discordjs/voice');
// joinVC = async (client, message, args) => {
//     const channel = GUILD_CHANNEL_IDS.TEST_SERVER.VC_GENERAL;

//     const connection = ""
// };

client.on(Events.ClientReady, () => {
    Logger.logReady(client);
});

const RESPONSE_CHANCE = 0.2;
const FORCE_RESPONSE_STRINGS = [
    "alan", "dat", "ham", userMention(USER_IDS.ALANBOT),
]
client.on(Events.MessageCreate, message => {
    MessageResponder.SambotResponder.conceptZero(message);
    // MessageResponder.SambotResponder.respondToAllMessages(message);

    if (!message.author.bot) {
        MessageResponder.HumanResponder.respondToHiAlanbot(message);
        MessageResponder.HumanResponder.respondToRepliesHi(message);
        MessageResponder.HumanResponder.respondToPingString(message);

        const isReplyToAlanbot = message.type == MessageType.Reply && message.channel.messages.cache.get(message.reference.messageId).author.id == USER_IDS.ALANBOT;
        let forceResponse = false;
        for (let i = 0; i < FORCE_RESPONSE_STRINGS.length; i++) {
            if (message.content.toLowerCase().indexOf(FORCE_RESPONSE_STRINGS[i]) != -1) {
                forceResponse = true;
                break;
            }
        }
        if (isReplyToAlanbot || forceResponse || Math.random() < RESPONSE_CHANCE) {
            MessageResponder.HumanResponder.respondToIm(message);
            MessageResponder.HumanResponder.respondToJoevers(message);
            if (IAN_GUILDS.has(Number(message.guildId))) {
                MessageResponder.HumanResponder.respondToTess(message);
                MessageResponder.HumanResponder.respondToScreens(message);
                MessageResponder.HumanResponder.respondToSambotString(message);
                MessageResponder.HumanResponder.respondToEr(message);
            }    
        }
    }
});

client.on(Events.PresenceUpdate, (oldpresence, newpresence) => {
    PresenceLogger.logSambotChange(client, oldpresence, newpresence)
});


client.login(process.env.TOKEN);