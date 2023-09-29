const GuildChannelIDs = require("./IDs/GuildChannelIDs");


const TAB_LENGTH = 8;

const Logger = {
    logResponse: (message, name) => {
        let logMessage = `${name}\t| ${message.guild.name}\t| ${message.channel.name}\t| ${message.author.username}\t| ${message.createdAt.toISOString()}`;
        console.log(logMessage);
        message.client.channels.cache.get(GuildChannelIDs.test_server.alanbot_logs).send(`\`\`\`${logMessage}\`\`\``);
    },
    logReady: (client, c) => {
        let logMessage = `\nRunning from ${process.env.DEVICE}.`
                       + `\nReady! Logged in as ${c.user.tag} in the following servers:`
        client.guilds.cache.forEach((guild, key, map) => {
            logMessage += `\n${guild.id}\t${guild.name}`;
        });

        console.log(logMessage);
        console.log("---------------------------------------------------------------");
        
        client.channels.cache.get(GuildChannelIDs.test_server.alanbot_logs).send(`\`\`\`${logMessage}\`\`\``);
    },
}

module.exports = Logger;