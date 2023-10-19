// const fs = require("fs");

const GUILD_CHANNEL_IDS = require("./IDS/GUILD_CHANNEL_IDS");


const TAB_LENGTH = 8;

const Logger = {
    logResponse: (message, name) => {
        let logMessage = `RESPONSE ;; ${process.env.DEVICE} ;; ${name} ;; ${message.guild.name} ;; ${message.channel.name} ;; ${message.author.username} ;; ${message.createdAt.toISOString()}`;


        console.log(logMessage);

        message.client.channels.cache.get(GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS).send(`\`\`\`${logMessage}\`\`\``);
        message.client.channels.cache.get(GUILD_CHANNEL_IDS.TEST_SERVER.RESPONSE_LOGS).send(`\`\`\`${logMessage}\`\`\``);
    },

    logReady: (client) => {
        let time = new Date();
        let logMessage = `\nREADY`
                       + `\nDEVICE: ${process.env.DEVICE}`
                       + `\n${time.toISOString()}`
                       + `\nReady! Logged in as ${client.user.tag} in the following servers:`
        client.guilds.cache.forEach((guild, key, map) => {
            logMessage += `\n\t${guild.id}\t${guild.name}`;
        });


        console.log(logMessage);
        console.log("---------------------------------------------------------------");
        
        // fs.appendFileSync("./alanbot-logs/ready-logs.txt", logMessage + "\n", (err) => {
        //     if (err) {
        //         console.error(err);
        //     }
        // });

        client.channels.cache.get(GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS).send(`\`\`\`${logMessage}\`\`\``);
        client.channels.cache.get(GUILD_CHANNEL_IDS.TEST_SERVER.READY_LOGS).send(`\`\`\`${logMessage}\`\`\``);

        // fs.appendFileSync("./alanbot-logs/ready-logs.txt", "SUCCESS\n\n", (err) => {
        //     if (err) {
        //         console.error(err);
        //     }
        // });
    },

    logUnhandledPromiseRejectionToFile: (e, client, numErrorsThisSession) => {
        let time = new Date();
        let logMessageWithoutStack = `\nERROR: UNHANDLED PROMISE REJECTION`
                                   + `\nDEVICE: ${process.env.DEVICE}`
                                   + `\nTHIS IS ERROR NUMBER ${numErrorsThisSession} IN THIS SESSION`
                                   + `\n${time.toISOString()}`
                                   + `\n`;
        let logMessage = logMessageWithoutStack + e.stack 
                       + `\n${numErrorsThisSession >= 10 ? "PROGRAM TERMINATED." : "PROGRAM NOT TERMINATED?"}\n\n`;
        

        console.error('Unhandled promise rejection:', e);

        // fs.appendFileSync("./alanbot-logs/error-logs.txt", logMessage, (err) => {
        //     if (err) {
        //         console.error(err);
        //     }
        // });

        client.channels.cache.get(GUILD_CHANNEL_IDS.TEST_SERVER.ALL_LOGS).send(`\`\`\`${logMessage}\`\`\``);
        client.channels.cache.get(GUILD_CHANNEL_IDS.TEST_SERVER.ERROR_LOGS).send(`\`\`\`${logMessage}\`\`\``);
    },
}

module.exports = Logger;