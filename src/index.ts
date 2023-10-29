import { Client, GatewayIntentBits, Events, MessageType, Message, userMention, VoiceBasedChannel, TextBasedChannel } from 'discord.js';
import 'dotenv/config';

import MessageResponder from "./MessageResponder";
import Logger from "./Logger";
import PresenceLogger from "./PresenceLogger";
import VoiceChatHandler from './VoiceChatHandler';

import USER_IDS from "./IDS/USER_IDS";
import GUILD_IDS from "./IDS/GUILD_IDS";
import GUILD_CHANNEL_IDS from "./IDS/GUILD_CHANNEL_IDS";


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
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


client.on(Events.ClientReady, () => {
    Logger.logReady(client);
});

client.on(Events.MessageCreate, MessageResponder.respond);

client.on(Events.PresenceUpdate, PresenceLogger.logSambotChange);


client.login(process.env.TOKEN);