const { Client, GatewayIntentBits, Events } = require('discord.js');
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

client.on(Events.MessageCreate, message => {

    MessageResponder.SambotResponder.conceptZero(message);
    // MessageResponder.SambotResponder.respondToAllMessages(message);

    if (!message.author.bot) {
        MessageResponder.HumanResponder.respondToPingString(message);
        MessageResponder.HumanResponder.respondToIm(message);
        MessageResponder.HumanResponder.respondToJoevers(message);
        MessageResponder.HumanResponder.respondToHiAlanbot(message);
        if (IAN_GUILDS.has(Number(message.guildId))) {
            MessageResponder.HumanResponder.respondToTess(message);
            MessageResponder.HumanResponder.respondToScreens(message);
            MessageResponder.HumanResponder.respondToSambotString(message);
        }
    }
});

client.on(Events.PresenceUpdate, (oldpresence, newpresence) => {
    PresenceLogger.logSambotChange(client, oldpresence, newpresence)
});


client.login(process.env.TOKEN);