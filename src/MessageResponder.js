const Logger = require("./Logger.js");
const USER_IDS = require("./IDS/USER_IDS.js");


const TESSES = ['ess', 'est'];
const TICKLE = ' tickles very tasty';

const IMS = ["im", "i'm", "i am", "iam", "i was", "i will be", "i'll be", "ill be", 
                "i have been", "i've been", "ive been", "i had been", "i'd been", "id been",
                "i will have been", "i'll have been", "ill have been",
];

// const UH_OHS = ["uh oh", "oh no", "i forgot"];
// const JOEVERS = ["bruh it's actually joever", "joever", "it's joever", "wait is it joever", ];



const MAX_RESPONSES_TO_SAM = 10;
let numResponsesToSam = 0;

const reply = (message, replyMessage, allowMention) => {
    if (allowMention) {
        message.reply({
            content: replyMessage,
        });
    } else {
        message.reply({
            content: replyMessage,
            allowedMentions: { parse: [] },
        });
    }
    
}

const MessageResponder = {
    SambotResponder: {
        // MAX_RESPONSES_TO_SAM: 10,
        // numResponsesToSam: 0,
        conceptZero: (message) => {
            if (message.author.id == USER_IDS.SAMBOT) {
                Logger.logResponse(message, "SB msg");
                if (message.content.indexOf("concept of zero") != -1) {
                    const responseCondition = numResponsesToSam < MAX_RESPONSES_TO_SAM;
                    if (responseCondition) {
                        reply(message, `wow what a fun fact`, false);
                    }
                    Logger.logResponse(message, `SB 0 r${numResponsesToSam}${responseCondition ? "t" : "f"}`);
                    numResponsesToSam++;
                }
            }
        },
        respondToAllMessages: (message) => {
            if (message.author.id == USER_IDS.SAMBOT) {
                Logger.logResponse(message, "SB msg");
                const responseCondition = numResponsesToSam < MAX_RESPONSES_TO_SAM;
                if (responseCondition) {
                    reply(message, `if you can see this message that means bots can respond to other bots`, false);
                }
                Logger.logResponse(message, `SB All r${numResponsesToSam}${responseCondition ? "t" : "f"}`);
                numResponsesToSam++;
            }
        }
    },
    HumanResponder: {
        respondToPingString: (message) => {
            if (message.content == "ping") {
                reply(message, "pong", true);
                Logger.logResponse(message, "ponged");
            }
        },
        respondToHiAlanbot: (message) => {
            if (message.content.toLowerCase() == "hi alanbot") {
                reply(message, "hi", true);
                Logger.logResponse(message, "hialan");
            }
        },
        respondToTess: (message) => {
            let messageLowercase = message.content.toLowerCase();
            let indexOfLastTessInMessage = -1;
            let indexOfLastTessInArray = -1;
            for (let i = 0; i < TESSES.length; i++) {
                let lastIndex = messageLowercase.lastIndexOf(TESSES[i]);
                if (lastIndex + TESSES[i].length + TICKLE.length >= 2000) { // checks if message is too long
                    reply(message, `nice try but i fixed it`, false);
                } else if (lastIndex > indexOfLastTessInMessage) {
                    indexOfLastTessInMessage = lastIndex;
                    indexOfLastTessInArray = i;
                }
            }
            if (indexOfLastTessInMessage != -1) {
                reply(message, `${message.content.substring(0, indexOfLastTessInMessage + TESSES[indexOfLastTessInArray].length)}${TICKLE}`, false);
                Logger.logResponse(message, `t:${TESSES[indexOfLastTessInArray]}`);
            }
        },
        respondToScreens: (message) => {
            let messageLowercase = message.content.toLowerCase();
            if (messageLowercase.indexOf('eens') != -1 || messageLowercase.indexOf('eans') != -1) {
                reply(message, `cool ${message.content.substring(0, Math.max(messageLowercase.lastIndexOf('eens'), messageLowercase.lastIndexOf('eans')) + 4)}`, false);
                Logger.logResponse(message, "screens");
            }
        },
        respondToSambotString: (message) => {
            let messageLowercase = message.content.toLowerCase();
            if (messageLowercase.indexOf('sambot') != -1) {
                reply(message, `${message.content.substring(0, messageLowercase.lastIndexOf('sambot') + 6)} > alanbot`, false);
                Logger.logResponse(message, "sb>ab");
            }
        },
        respondToIm: (message) => {
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
                
                reply(message, `hi ${message.content.substring(startIndex)}`, false);
                Logger.logResponse(message, `im:${indexOfFirstImInArray}`);
            }
        },
        // respondToJoevers: (message) => {

        // },
    },
}

module.exports = MessageResponder;