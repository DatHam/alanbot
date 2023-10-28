import { Client, GatewayIntentBits, Events, MessageType, Message, userMention } from 'discord.js';
import 'dotenv/config';

import MessageResponder from "./MessageResponder";
import Logger from "./Logger";
import PresenceLogger from "./PresenceLogger";

import USER_IDS from "./IDS/USER_IDS";
import GUILD_IDS from "./IDS/GUILD_IDS";
import GUILD_CHANNEL_IDS from "./IDS/GUILD_CHANNEL_IDS";

// const IAN_GUILDS = new Set<string>();
// IAN_GUILDS.add(GUILD_IDS.EGGLESSBONKER);
// IAN_GUILDS.add(GUILD_IDS.GEOGUSSRY);
// IAN_GUILDS.add(GUILD_IDS.JHS_ORCHESTRA);
// IAN_GUILDS.add(GUILD_IDS.TEST_SERVER);

const IAN_GUILDS = [
    GUILD_IDS.EGGLESSBONKER,
    GUILD_IDS.GEOGUSSRY,
    GUILD_IDS.JHS_ORCHESTRA,
    GUILD_IDS.TEST_SERVER,
]


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
process.on('unhandledRejection', (error: Error | any, promise: Promise<any>) => {
    numErrorsThisSession++;
    Logger.logUnhandledPromiseRejectionToFile(error, promise, client, numErrorsThisSession);
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
        MessageResponder.HumanResponder.respondToSambotString(message);
        MessageResponder.HumanResponder.respondToJoevers(message);

        const isReplyToAlanbot = message.type == MessageType.Reply && message.channel.messages.cache.get(message.reference?.messageId || "")?.author.id == USER_IDS.ALANBOT;
        let forceResponse = false;
        for (let i = 0; i < FORCE_RESPONSE_STRINGS.length; i++) {
            if (message.content.toLowerCase().indexOf(FORCE_RESPONSE_STRINGS[i]) != -1) {
                forceResponse = true;
                break;
            }
        }
        if (message.author.id == USER_IDS.CREEHOP || isReplyToAlanbot || forceResponse || Math.random() < RESPONSE_CHANCE) {
            MessageResponder.HumanResponder.respondToIm(message);
            if (IAN_GUILDS.indexOf(message.guildId || "") != -1) {
                MessageResponder.HumanResponder.respondToTess(message);
                MessageResponder.HumanResponder.respondToScreens(message);
                MessageResponder.HumanResponder.respondToEr(message);
            }    
        }
    }
});

client.on(Events.PresenceUpdate, (oldpresence, newpresence) => {
    PresenceLogger.logSambotChange(client, oldpresence, newpresence)
});


client.login(process.env.TOKEN);