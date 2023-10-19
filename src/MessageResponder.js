const Logger = require("./Logger.js");
const USER_IDS = require("./IDS/USER_IDS.js");


const TESSES = ['ess', 'est'];
const TICKLE = ' tickles very tasty';

const IMS = [   "i am", "i'm", "im", "iam", 
                "i was", 
                "i will be", "i'll be", "ill be", 
                "i have been", "i've been", "ive been", 
                "i had been", "i'd been", "id been",
                "i will have been", "i'll have been", "ill have been", 
                "i will of been", "i'll of been", "ill of been",
                "i will've been", "i'll've been", "ill've been",
                "i willve been", "i'llve been", "illve been",
];

const ITS = [   "actually", 
                "it is", "it's", "its", 
                "it was", 
                "it will be", "it'll be", "itll be",
                "it has been", "it's been", "its been", 
                "it had been", "it'd been", "itd been",
                "it will have been", "it'll have been", "itll have been",
                "it will've been", "it'll've been", "itll've been",
                "it willve been", "it'llve been", "itllve been",
                "it is going to be", "it's going to be", "its going to be",
                "it is gonna be", "it's gonna be", "its gonna be",
                "it is going to have been", "it's going to have been", "its going to have been",
                "it is gonna have been", "it's gonna have been", "its gonna have been",

                "it has to be", 
                "it will have to be", "it'll have to be", "itll have to be",
];
const ITS_JOEVER = " joever";

const UH_OHS = [    "uh oh", "oh no", 
                    "i still need to", "i really need to", "i still haven't done",
];
const JOEVERS = [   "joever", "it's joever", "actually joever", "it's actually joever", "it's actually joever wtf",
                    "bruh it's joever", "bruh it's actually joever", "bruh it's actually joever wtf",
                    "so joever", "it's so joever", "actually so joever", "it's actually so joever", "it's actually so joever wtf",
                    "bruh it's so joever", "bruh it's actually so joever", "bruh it's actually so joever wtf",
                    "is it joever", "is it actually joever",
                    "bruh is it joever", "bruh is it actually joever",
];



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

const changeQuotesToApostrophes = (str) => {
    return str.replaceAll(/"/g, "'");
}



const JoeverHelper = {
    // responds whenever a message ends with any string in ITS
    respondToIts: (message) => {
        let messageLowercase = changeQuotesToApostrophes(message.content.toLowerCase());
        for (let i = 0; i < ITS.length; i++) {
            if (messageLowercase.endsWith(ITS[i])) {
                let uppercaseCount = message.content.replace(/[^A-Z]/g, '').length;
                let lowercaseCount = message.content.replace(/[^a-z]/g, '').length;

                if (uppercaseCount >= lowercaseCount) {
                    reply(message, `${message.content}${ITS_JOEVER.toUpperCase()}`, false);
                    Logger.logResponse(message, `joe:${ITS[i].toUpperCase()}`);
                } else {
                    reply(message, `${message.content}${ITS_JOEVER.toLowerCase()}`, false);
                    Logger.logResponse(message, `joe:${ITS[i].toLowerCase()}`);
                }
                return true;
            }
        }
        return false;
    },
    respondToUhOh: (message) => {
        let messageLowercase = changeQuotesToApostrophes(message.content.toLowerCase());
        for (let i = 0; i < UH_OHS.length; i++) {
            if (messageLowercase.indexOf(UH_OHS[i]) != -1) {
                let uppercaseCount = message.content.replace(/[^A-Z]/g, '').length;
                let lowercaseCount = message.content.replace(/[^a-z]/g, '').length;
                let response = JOEVERS[Math.floor(Math.random() * JOEVERS.length)];
                if (uppercaseCount >= lowercaseCount) {
                    response = response.toUpperCase();
                } 

                reply(message, `${response}`, false);
                Logger.logResponse(message, `joe:${UH_OHS[i]}:${response}`);
                return true;
            }
        }
        return false;
    },
};



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
            let messageLowercase = changeQuotesToApostrophes(message.content.toLowerCase());
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
        respondToJoevers: (message) => {
            if (JoeverHelper.respondToIts(message)) {
                return;
            }
            if (JoeverHelper.respondToUhOh(message)) {
                return;
            }
        },
    },
};

module.exports = MessageResponder;