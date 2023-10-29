import { Client, Presence, MessageType, userMention, Message, BaseGuildTextChannel } from "discord.js";

import Logger from "./Logger";
import USER_IDS from "./IDS/USER_IDS";
import GUILD_CHANNEL_IDS from "./IDS/GUILD_CHANNEL_IDS";


const logPresenceChange = (client: Client<boolean>, oldpresence: Presence | null, newpresence: Presence, userID: string, channelID: string) => {
    const member = newpresence.member;
    // console.log(`${member?.user.username} changed presence from ${oldpresence?.status} to ${newpresence.status} in ${member?.guild}`);
    if (oldpresence != newpresence && (client.channels.cache.get(channelID) as BaseGuildTextChannel).guildId == member?.guild.id) {
        if (member.id == userID) {
            if (newpresence.status == "offline") {
                (client.channels.cache.get(channelID) as BaseGuildTextChannel).send("sambot went offline/invisible!!!!");
                Logger.logPresenceUpdate(client, oldpresence, newpresence, true);
                return true;
            } 
            if (newpresence.status == "online") {
                (client.channels.cache.get(channelID) as BaseGuildTextChannel).send("sambot went online!!!!");
                Logger.logPresenceUpdate(client, oldpresence, newpresence, true);
                return true;
            }
            Logger.logPresenceUpdate(client, oldpresence, newpresence, false);
        }
    }
    return false;
};

const PresenceLogger = {
    logSambotChange: (oldpresence: Presence | null, newpresence: Presence) => {
        const client = newpresence.client;
        logPresenceChange(client, oldpresence, newpresence, USER_IDS.SAMBOT, GUILD_CHANNEL_IDS.GEOGUSSRY.SAMBOT_PRESENCE_LOGS);
        // logPresenceChange(client, oldpresence, newpresence, USER_IDS.DATHAM, GUILD_CHANNEL_IDS.TEST_SERVER.TESTING_PRESENCE_UPDATES);
    },
}

export default PresenceLogger;