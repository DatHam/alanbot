const Logger = require("./Logger.js");


const TESSES = ['ess', 'est'];
const TICKLE = ' tickles very tasty';
const IMS = ["im", "i'm", "i am", "iam", "i was", "i will be", "i'll be", "ill be", 
                "i have been", "i've been", "ive been", "i had been", "i'd been", "id been",
                "i will have been", "i'll have been", "ill have been"
            ];

const MessageResponder = {
    pingpong: (message) => {
        if (message.content == 'ping') {
            message.reply('pong');
            Logger.logMessage(message, "ponged");
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
            Logger.logMessage(message, `t:${TESSES[indexOfLastTessInArray]}`);
        }
    },
    cool: (message) => {
        let messageLowercase = message.content.toLowerCase();
        if (messageLowercase.indexOf('eens') != -1 || messageLowercase.indexOf('eans') != -1) {
            message.reply({
                content: `cool ${message.content.substring(0, Math.max(messageLowercase.lastIndexOf('eens'), messageLowercase.lastIndexOf('eans')) + 4)}`,
                allowedMentions: { parse: [] },
            });
            Logger.logMessage(message, "cool");
        }
    },
    sambot: (message) => {
        let messageLowercase = message.content.toLowerCase();
        if (messageLowercase.indexOf('sambot') != -1) {
            message.reply({
                content: `${message.content.substring(0, messageLowercase.lastIndexOf('sambot') + 6)} > alanbot`,
                allowedMentions: { parse: [] },
            });
            Logger.logMessage(message, "sb>ab");
        }
    },
    im: (message) => {
        let messageLowercase = message.content.toLowerCase();
        let indexOfFirstImInMessage = Number.MAX_SAFE_INTEGER;
        let indexOfFirstImInArray = -1;

        for (let i = 0; i < IMS.length; i++) {
            let firstIndex = messageLowercase.indexOf(IMS[i]);
            if (firstIndex != -1 && firstIndex < indexOfFirstImInMessage) {
                indexOfFirstImInMessage = firstIndex;
                indexOfFirstImInArray = i;
            }
        }

        if (indexOfFirstImInMessage != Number.MAX_SAFE_INTEGER) {
            let startIndex = indexOfFirstImInMessage + IMS[indexOfFirstImInArray].length;
            if (messageLowercase.charAt(startIndex) == ' ') {
                startIndex++;
            }

            message.reply({
                content: `hi ${message.content.substring(startIndex)}`,
                allowedMentions: { parse: [] },
            });
            Logger.logMessage(message, `im:${indexOfFirstImInArray}`);
        }
    },
    
}

module.exports = MessageResponder;