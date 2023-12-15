import { Client, GatewayIntentBits, Events, MessageType, Message, userMention, VoiceBasedChannel, TextBasedChannel, ActivityType } from 'discord.js';
import 'dotenv/config';
import mongoose from 'mongoose';

import MessageResponder from "./MessageResponder";
import Logger from "./Logger";
import PresenceLogger from "./PresenceLogger";
import VoiceChatHandler from './VoiceChatHandler';
import ArbitraryMessageSendHandler from './ArbitraryMessageSendHandler';

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

// Connect to MongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, {  });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
})();

client.on(Events.ClientReady, () => {
    client.user?.setActivity({
        name: "alanbot",
        type: ActivityType.Custom,
    });
    Logger.logReady(client);
});

client.on(Events.MessageCreate, (message) => {
    MessageResponder.respond(message);
    ArbitraryMessageSendHandler.run(message);
});

client.on(Events.PresenceUpdate, PresenceLogger.logSambotChange);


client.login(process.env.TOKEN);