const Logger = require("./Logger.js");
const USER_IDS = require("./IDS/USER_IDS.js");
const GUILD_CHANNEL_IDS = require("./IDS/GULD_CHANNEL_IDS.js");


const logUserChange = (client, oldpresence, newpresence, userID, channelID) => {
    const member = newpresence.member;
    // console.log(`${member.user.username} changed presence from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status} in ${member.guild}`);
    if (oldpresence != newpresence && client.channels.cache.get(channelID).guildId == member.guild.id) {
        if (member.id == userID) {
            console.log("sambot changed it!!!!!!");
            if (newpresence.status == "offline") {
                console.log("sambot went offline");
                client.channels.cache.get(channelID).send("sambot went offline/invisible!!!!");
            } else if (newpresence.status == "online") {
                console.log("sambot went online");
                client.channels.cache.get(channelID).send("sambot went online!!!!");
            }
        } // else if (member.id == 508047929853083648) { // srikar joke code
        //     console.log(`${member.user.username} changed presence from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status} in ${member.guild}`);
        //     client.channels.cache.get(channelID).send(`${member.user.username} changed from ${oldpresence == null ? null : oldpresence.status} to ${newpresence == null ? null : newpresence.status}`);
        // }
    }
};

const PresenceLogger = {
    logSambotChange: (client, oldpresence, newpresence) => {
        logUserChange(client, oldpresence, newpresence, USER_IDS.SAMBOT, GUILD_CHANNEL_IDS.GEOGUSSRY.SAMBOT_PRESENCE_LOGS);
    },
}

module.exports = PresenceLogger;