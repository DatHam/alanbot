import { GuildChannelResolvable, Message, PermissionFlagsBits, TextChannel } from "discord.js";
import GUILD_CHANNEL_IDS from "./IDS/GUILD_CHANNEL_IDS";
import Logger from "./Logger";

const sendMessageToChannel = (message: Message<boolean>, channelID: string, messageToSend: string) => {
    const channel = message.client.channels.cache.get(channelID) as TextChannel;
    const hasPermissionToSendMessages = channel.guild.members.me?.permissionsIn(channel as GuildChannelResolvable).has(PermissionFlagsBits.SendMessages);
    console.log(hasPermissionToSendMessages);
    if (!hasPermissionToSendMessages) {
        Logger.logArbitraryMessageSend(message, "send", messageToSend, false);
        return false;
    }

    channel.send(messageToSend);
    Logger.logArbitraryMessageSend(message, "send", messageToSend, true);
    return true;
}

const sendReplyToMessage = (message: Message<boolean>, channelID: string, messageID: string, messageToSend: string) => {
    const channel = message.client.channels.cache.get(channelID) as TextChannel;
    const messageToReplyTo = channel.messages.cache.get(messageID);
    const hasPermissionToSendMessages = channel.guild.members.me?.permissionsIn(channel as GuildChannelResolvable).has(PermissionFlagsBits.SendMessages);

    if (messageToReplyTo == undefined) {
        Logger.logArbitraryMessageSend(message, "reply", messageToSend, undefined);
        return false;
    }

    if (!hasPermissionToSendMessages) {
        Logger.logArbitraryMessageSend(message, "reply", messageToSend, false);
        return false;
    }
    
    messageToReplyTo.reply({
        content: messageToSend,
    });

    Logger.logArbitraryMessageSend(message, "reply", messageToSend, true);
    return true;
}

const ArbitraryMessageSendHandler = {
    run: (message: Message<boolean>) => {
        if (message.channelId == GUILD_CHANNEL_IDS.TEST_SERVER.ARBITRARY_MESSAGE_REQUESTS) {
            const tokens = message.content.split(" ");
            const command = tokens[0];
            const args = tokens.slice(1);
            if (command == "send") {
                const channelID = args[0];
                const messageToSend = args.slice(1).join(" ");
                return sendMessageToChannel(message, channelID, messageToSend);
            } 
            if (command == "reply") {
                const channelID = args[0];
                const messageID = args[1];
                const messageToSend = args.slice(2).join(" ");
                return sendReplyToMessage(message, channelID, messageID, messageToSend);
            }
        }
    }
};

export default ArbitraryMessageSendHandler;