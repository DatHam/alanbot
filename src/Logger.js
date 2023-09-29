const GuildChannelIDs = require("./IDs/GuildChannelIDs");


const TAB_LENGTH = 8;

const Logger = {
    logResponse: (message, name) => {
        let logMessage = `${process.env.DEVICE} ;; ${name} ;; ${message.guild.name} ;; ${message.channel.name} ;; ${message.author.username} ;; ${message.createdAt.toISOString()}`;
        console.log(logMessage);
        message.client.channels.cache.get(GuildChannelIDs.test_server.alanbot_logs).send(`\`\`\`${logMessage}\`\`\``);
    },
    logReady: (client, c) => {
        let logMessage = `\nRunning from ${process.env.DEVICE}.`
                       + `\nReady! Logged in as ${client.user.tag} in the following servers:`
        client.guilds.cache.forEach((guild, key, map) => {
            logMessage += `\n${guild.id}\t${guild.name}`;
        });

        console.log(logMessage);
        console.log("---------------------------------------------------------------");
        
        client.channels.cache.get(GuildChannelIDs.test_server.alanbot_logs).send(`\`\`\`${logMessage}\`\`\``);
    },
}

module.exports = Logger;