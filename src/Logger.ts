import { Client, Message, BaseGuildTextChannel, BaseGuildVoiceChannel, Presence, VoiceBasedChannel } from 'discord.js';

import GUILD_CHANNEL_IDS from "./IDS/GUILD_CHANNEL_IDS";


const sendLogToChannel = (client: Client<boolean>, channelID: string, logMessage: string) => {
    (client.channels.cache.get(channelID) as BaseGuildTextChannel)
        .send(`\`\`\`${logMessage}\`\`\``);
};

const Logger = {
    logResponse: (message: Message<boolean> , logName: string, hasPermissionToSendMessages?: boolean) => {
        const guildName = message.guild?.name;
        const channelName = (message.channel as BaseGuildTextChannel | BaseGuildVoiceChannel).name
        const logMessage = `${process.env.DEVICE} ;; RESPONSE ;; SEND_MESSAGE_PERMISSION:${hasPermissionToSendMessages} ;; ${logName} ;; ${guildName} ;; ${channelName} ;; ${message.author.username} ;; ${message.id} ;; ${message.createdAt.toISOString()}`;

        console.log(logMessage);

        sendLogToChannel(message.client, GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS, logMessage);
        sendLogToChannel(message.client, GUILD_CHANNEL_IDS.TEST_SERVER.RESPONSE_LOGS, logMessage);
    },

    logVC: (voiceChannel: VoiceBasedChannel, logName: string) => {
        const guildName = voiceChannel.guild.name;
        const channelName = voiceChannel.name;
        const time = new Date();
        const logMessage = `${process.env.DEVICE} ;; VC ;; ${logName} ;; ${guildName} ;; ${channelName} ;; ${time.toISOString()}`

        console.log(logMessage);
        
        sendLogToChannel(voiceChannel.client, GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS, logMessage);
        sendLogToChannel(voiceChannel.client, GUILD_CHANNEL_IDS.TEST_SERVER.VC_LOGS, logMessage);
    },

    logArbitraryMessageSend: (message: Message<boolean>, logName: string, content: string, hasPermissionToSendMessages?: boolean) => {
        const logMessage = `${process.env.DEVICE} ;; ARBITRARY_MESSAGE_SEND ;; SEND_MESSGAE_PERMISSION:${hasPermissionToSendMessages} ;; ${logName} ;; request by: ${message.author.username} ;; ${message.createdAt.toISOString()} ;; ${content}`;

        console.log(logMessage);

        sendLogToChannel(message.client, GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS, logMessage);
        sendLogToChannel(message.client, GUILD_CHANNEL_IDS.TEST_SERVER.ARBITRARY_MESSAGE_REQUESTS, logMessage);
    },

    logReady: (client: Client<boolean>) => {
        const time = new Date();
        let logMessage = `\nREADY`
                       + `\nDEVICE: ${process.env.DEVICE}`
                       + `\n${time.toISOString()}`
                       + `\nReady! Logged in as ${client.user?.tag} in the following servers:`
        client.guilds.cache.forEach((guild, key, map) => {
            logMessage += `\n\t${guild.id}\t${guild.name}`;
        });

        console.log(logMessage);
        console.log("---------------------------------------------------------------");

        sendLogToChannel(client, GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS, logMessage);
        sendLogToChannel(client, GUILD_CHANNEL_IDS.TEST_SERVER.READY_LOGS, logMessage);
    },

    logPresenceUpdate: (client: Client, oldpresence: Presence | null, newpresence: Presence, messageSent: boolean) => {
        const member = newpresence.member;
        const logMessage = `${member?.user.username} changed presence from ${oldpresence?.status} to ${newpresence.status} in ${member?.guild}`
                         + `\n\tmessageSent=${messageSent}`;

        console.log(logMessage);

        sendLogToChannel(client, GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS, logMessage);
        sendLogToChannel(client, GUILD_CHANNEL_IDS.TEST_SERVER.PRESENCE_UPDATE_LOGS, logMessage);
    },

    logUnhandledPromiseRejectionToFile: (e: Error | any, promise: Promise<any>, client: Client, numErrorsThisSession: number) => {
        const time = new Date();
        const logMessageWithoutStack = `\nERROR: UNHANDLED PROMISE REJECTION`
                                   + `\nDEVICE: ${process.env.DEVICE}`
                                   + `\nTHIS IS ERROR NUMBER ${numErrorsThisSession} IN THIS SESSION`
                                   + `\n${time.toISOString()}`
                                   + `\n`;
        const logMessage = logMessageWithoutStack + e.stack 
                       + `\n${numErrorsThisSession >= 10 ? "PROGRAM TERMINATED." : "PROGRAM NOT TERMINATED?"}\n\n`;
        

        console.error(logMessageWithoutStack, e);

        sendLogToChannel(client, GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS, logMessage);
        sendLogToChannel(client, GUILD_CHANNEL_IDS.TEST_SERVER.ERROR_LOGS, logMessage);
    },
}

export default Logger;