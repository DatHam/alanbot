const Logger = {
    logMessage: (message, name) => {
        console.log(`${name}\t| ${message.guild.name}\t| ${message.channel.name}\t| ${message.author.username}\t| ${message.createdAt.toString()}`);
    },
}

module.exports = Logger;