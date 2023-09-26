const TESSES = ['ess', 'est'];
const TICKLE = ' tickles very tasty';
const IMS = ["im", "i'm", "i am", "iam"];

const logMessage = (message, name) => {
    console.log(`${name}\t| ${message.guild.name}\t| ${message.channel.name}\t| ${message.author.username}\t| ${message.createdAt.toString()}`);
};

const MessageResponder = {
    pingpong: (message) => {
        if (message.content == 'ping') {
            message.reply('pong');
            logMessage(message, "ponged");
        }
    },
    tess: (message) => {
        let messageLowercase = message.content.toLowerCase();
        let indexOfLastTessInMessage = -1;
        let indexOfLastTessInArray = -1;
        for (let i = 0; i < TESSES.length; i++) {
            let lastIndex = messageLowercase.lastIndexOf(TESSES[i]);
            if (lastIndex + TESSES[i].length + TICKLE.length >= 2000) { // checks if message is too long
                message.reply({
                    content: `nice try but i fixed it`,
                    allowedMentions: { parse: [] },
                })
            } else if (lastIndex > indexOfLastTessInMessage) {
                indexOfLastTessInMessage = lastIndex;
                indexOfLastTessInArray = i;
            }
        }
        if (indexOfLastTessInMessage != -1) {
            message.reply({
                content: `${message.content.substring(0, indexOfLastTessInMessage + TESSES[indexOfLastTessInArray].length)}${TICKLE}`,
                allowedMentions: { parse: [] },
            });
            logMessage(message, `t:${TESSES[indexOfLastTessInArray]}`);
        }
    },
    cool: (message) => {
        let messageLowercase = message.content.toLowerCase();
        if (messageLowercase.indexOf('eens') != -1 || messageLowercase.indexOf('eans') != -1) {
            message.reply({
                content: `cool ${message.content.substring(0, Math.max(messageLowercase.lastIndexOf('eens'), messageLowercase.lastIndexOf('eans')) + 4)}`,
                allowedMentions: { parse: [] },
            });
            logMessage(message, "cool");
        }
    },
    sambot: (message) => {
        let messageLowercase = message.content.toLowerCase();
        if (messageLowercase.indexOf('sambot') != -1) {
            message.reply({
                content: `${message.content.substring(0, messageLowercase.lastIndexOf('sambot') + 6)} > alanbot`,
                allowedMentions: { parse: [] },
            });
            logMessage(message, "sb>ab");
        }
    },
    im: (message) => {
        let messageLowercase = message.content.toLowerCase();
        let indexOfFirstImInMessage = -1;
        let indexOfFirstImInArray = -1;

        for (let i = 0; i < IMS.length; i++) {
            let firstIndex = messageLowercase.indexOf(IMS[i]);
            if (firstIndex > indexOfFirstImInMessage) {
                indexOfFirstImInMessage = firstIndex;
                indexOfFirstImInArray = i;
            }
        }

        if (indexOfFirstImInMessage != -1) {
            let startIndex = indexOfFirstImInMessage + IMS[indexOfFirstImInArray].length;
            if (messageLowercase.charAt(startIndex) == ' ') {
                startIndex++;
            }

            message.reply({
                content: `hi ${message.content.substring(startIndex)}`,
                allowedMentions: { parse: [] },
            });
            logMessage(message, `im:${IMS[indexOfFirstImInArray]}`);
        }
    },
    
}

module.exports = MessageResponder;