import { MessageType, userMention, Message, channelLink, channelMention, VoiceBasedChannel, ChannelType } from "discord.js";

import Logger from "./Logger";
import VoiceChatHandler from "./VoiceChatHandler";

import USER_IDS from "./IDS/USER_IDS";
import GUILD_IDS from "./IDS/GUILD_IDS";


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

                "is it", "'s it", "s it",
                "was it",
                "will it be", "'ll it be", "ll it be",
                "has it been", "'s it been", "s it been", 
                "had it been", "'d it been", "d it been",
                "will it have been", "will it've been", "will itve been",
                "'ll it have been", "'ll it've been", "ll it've been",
                "ll it have been", "ll it've been", "ll itve been",
                "is it going to be", "'s it going to be", "s it going to be",
                "is it gonna be", "'s it gonna be", "s it gonna be",
                "is it going to have been", "'s it going to have been", "s it going to have been",
                "is it gonna have been", "'s it gonna have been", "s it gonna have been",
];
const ITS_JOEVER = " joever";

const UH_OHS = [    "uh oh", "oh no", 
                    "i still need to", "i really need to", "i still haven't done",
                    "i forgot to do",
];
const JOEVERS = [   "joever", "it's joever", "actually joever", "it's actually joever", "it's actually joever wtf",
                    "bruh it's joever", "bruh it's actually joever", "bruh it's actually joever wtf",
                    "so joever", "it's so joever", "actually so joever", "it's actually so joever", "it's actually so joever wtf",
                    "bruh it's so joever", "bruh it's actually so joever", "bruh it's actually so joever wtf",
                    "is it joever", "is it actually joever",
                    "bruh is it joever", "bruh is it actually joever",
];

const GREETINGS = [ "hi",
                    "hey", "hello", "yo", "salutations",
                    "anneyonghaseyo", "anneyong", "ni hao", "nihao", "konnichiwa",
                    "namaste", "zdravstvuyte", "privet",
                    "hola", "aloha", "bonjour", "salut", "hallo", "ciao",
];


const MAX_RESPONSES_TO_SAM = 10;
let numResponsesToSam = 0;


const reply = async (message: Message<boolean>, replyMessage: string, allowMention: boolean) => {
    await message.channel.sendTyping();
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

const changeQuotesToApostrophes = (str: string) => {
    return str.replaceAll(/"/g, "'");
}



const JoeverHelper = {
    /**
     * Responds whenever a message ends with any string in ITS with:
     * * message + " joever"
     * 
     * If message has more uppercase characters than lowercase characters, then it responds with:
     * * message + " JOEVER"
     * @param {*} message the message object from discord
     * @returns true if responded and false if not
     */
    respondToIts: (message: Message<boolean>) => {
        const messageLowercase = changeQuotesToApostrophes(message.content.toLowerCase());
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
    respondToUhOh: (message: Message<boolean>) => {
        const messageLowercase = changeQuotesToApostrophes(message.content.toLowerCase());
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


const SambotResponder = {
    // MAX_RESPONSES_TO_SAM: 10,
    // numResponsesToSam: 0,
    conceptZero: (message: Message<boolean>) => {
        if (message.author.id == USER_IDS.SAMBOT) {
            Logger.logResponse(message, "SB msg");
            if (message.content.indexOf("concept of zero") != -1) {
                const responseCondition = numResponsesToSam < MAX_RESPONSES_TO_SAM;
                if (responseCondition) {
                    reply(message, `wow what a fun fact`, false);
                    return true
                }
                Logger.logResponse(message, `SB 0 r${numResponsesToSam}${responseCondition ? "t" : "f"}`);
                numResponsesToSam++;
            }
        }
        return false;
    },
    respondToAllMessages: (message: Message<boolean>) => {
        if (message.author.id == USER_IDS.SAMBOT) {
            Logger.logResponse(message, "SB msg");
            const responseCondition = numResponsesToSam < MAX_RESPONSES_TO_SAM;
            if (responseCondition) {
                reply(message, `if you can see this message that means bots can respond to other bots`, false);
                return true;
            }
            Logger.logResponse(message, `SB All r${numResponsesToSam}${responseCondition ? "t" : "f"}`);
            numResponsesToSam++;
        }
        return false;
    }
};

const HumanResponder = {
    respondToPingString: (message: Message<boolean>) => {
        if (message.content == "ping") {
            reply(message, "pong ", true);
            Logger.logResponse(message, "ponged");
            return true;
        }
        return false;
    },
    respondToHiAlanbot: (message: Message<boolean>) => {
        if (message.content.toLowerCase() == "hi alanbot") {
            reply(message, "hi", true);
            Logger.logResponse(message, "hialan");
            return true;
        }
        return false;
    },
    respondToTess: (message: Message<boolean>) => {
        const messageLowercase = message.content.toLowerCase();
        let indexOfLastTessInMessage = -1;
        let indexOfLastTessInArray = -1;
        for (let i = 0; i < TESSES.length; i++) {
            const lastIndex = messageLowercase.lastIndexOf(TESSES[i]);
            if (lastIndex + TESSES[i].length + TICKLE.length >= 2000) { // checks if message is too long
                reply(message, `nice try but i fixed it`, false);
                Logger.logResponse(message, `t:nice try`);
            } else if (lastIndex > indexOfLastTessInMessage) {
                indexOfLastTessInMessage = lastIndex;
                indexOfLastTessInArray = i;
            }
        }
        if (indexOfLastTessInMessage != -1) {
            reply(message, `${message.content.substring(0, indexOfLastTessInMessage + TESSES[indexOfLastTessInArray].length)}${TICKLE}`, false);
            Logger.logResponse(message, `t:${TESSES[indexOfLastTessInArray]}`);
            return true;
        }
        return false;
    },
    respondToScreens: (message: Message<boolean>) => {
        const messageLowercase = message.content.toLowerCase();
        if (messageLowercase.indexOf('eens') != -1 || messageLowercase.indexOf('eans') != -1) {
            reply(message, `cool ${message.content.substring(0, Math.max(messageLowercase.lastIndexOf('eens'), messageLowercase.lastIndexOf('eans')) + 4)}`, false);
            Logger.logResponse(message, "screens");
            return true;
        }
        return false;
    },
    respondToSambotString: (message: Message<boolean>) => {
        const messageLowercase = message.content.toLowerCase();
        if (messageLowercase.indexOf('sambot') != -1) {
            reply(message, `${message.content.substring(0, messageLowercase.lastIndexOf('sambot') + 6)} > alanbot`, false);
            Logger.logResponse(message, "sb>ab");
            return true;
        }
        return false;
    },
    respondToIm: (message: Message<boolean>) => {
        const messageLowercase = changeQuotesToApostrophes(message.content.toLowerCase());
        let indexOfFirstImInMessage = Number.MAX_SAFE_INTEGER;
        let indexOfFirstImInArray = -1;

        for (let i = 0; i < IMS.length; i++) {
            const firstIndex = messageLowercase.indexOf(IMS[i]);
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
            return true;
        }
        return false;
    },
    respondToJoevers: (message: Message<boolean>) => {
        if (JoeverHelper.respondToIts(message)) {
            return true;
        }
        if (JoeverHelper.respondToUhOh(message)) {
            return true;
        }
        return false;
    },
    respondToEr: (message: Message<boolean>) => {
        const messageLowercase = message.content.toLowerCase();
        if (messageLowercase.endsWith("er")) {
            reply(message, "i hardly know er", false);
            Logger.logResponse(message, `er`);
            return true;
        }
        return false;
    },
    respondToRepliesHi: (message: Message<boolean>) => {
        if (message.type == MessageType.Reply) {
            const repliedMessage = message.channel.messages.cache.get(message.reference?.messageId || "");
            if (repliedMessage?.author.id == USER_IDS.ALANBOT) {
                const messageLowercase = message.content.toLowerCase();
                for (let i = 0; i < GREETINGS.length; i++) {
                    if (messageLowercase.indexOf(GREETINGS[i]) != -1) {
                        reply(message, `hi`, true);
                        Logger.logResponse(message, `reply: ${GREETINGS[i]}`);
                        return true;
                    }
                }
            }
        }
        if (message.content.indexOf(userMention(USER_IDS.ALANBOT)) != -1) {
            const messageLowercase = message.content.toLowerCase();
                for (let i = 0; i < GREETINGS.length; i++) {
                    if (messageLowercase.indexOf(GREETINGS[i]) != -1) {
                        reply(message, `hi`, true);
                        Logger.logResponse(message, `reply: ${GREETINGS[i]}`);
                        return true;
                    }
                }
        }
        return false;
    },
}

const VCResponder = {
    VCJoiner: (message: Message<boolean>) => {
        const messageLowercase = message.content.toLowerCase();
        if (messageLowercase.startsWith("join")) {
            message.mentions.channels.forEach((channel) => {
                if (channel.type == ChannelType.GuildVoice) {
                    VoiceChatHandler.joinVC(channel as VoiceBasedChannel);
                    return true;
                }
            });
        }
        return false;
    },
    VCLeaver: (message: Message<boolean>) => {
        const messageLowercase = message.content.toLowerCase();
        if (messageLowercase.startsWith("leave")) {
            if (message.mentions.channels.size != 0) {
                VoiceChatHandler.leaveVC(message.mentions.channels.first() as VoiceBasedChannel);
                return true;
            }
        }
        return false;
    }
}


const IAN_GUILDS = [
    GUILD_IDS.EGGLESSBONKER,
    GUILD_IDS.GEOGUSSRY,
    GUILD_IDS.JHS_ORCHESTRA,
    GUILD_IDS.TEST_SERVER,
]
const RESPONSE_CHANCE = 0.2;
const FORCE_RESPONSE_STRINGS = [
    "alan", "dat", "ham", userMention(USER_IDS.ALANBOT),
];
const MessageResponder = {
    respond: (message: Message<boolean>) => {

        SambotResponder.conceptZero(message);
        // SambotResponder.respondToAllMessages(message);

        if (!message.author.bot) {

            VCResponder.VCJoiner(message);
            VCResponder.VCLeaver(message);
            
            HumanResponder.respondToHiAlanbot(message);
            HumanResponder.respondToRepliesHi(message);
            HumanResponder.respondToPingString(message);
            HumanResponder.respondToSambotString(message);
            HumanResponder.respondToJoevers(message);

            const isReplyToAlanbot = message.type == MessageType.Reply && message.channel.messages.cache.get(message.reference?.messageId || "")?.author.id == USER_IDS.ALANBOT;
            let forceResponse = false;
            for (let i = 0; i < FORCE_RESPONSE_STRINGS.length; i++) {
                if (message.content.toLowerCase().indexOf(FORCE_RESPONSE_STRINGS[i]) != -1) {
                    forceResponse = true;
                    break;
                }
            }
            if (message.author.id == USER_IDS.CREEHOP || isReplyToAlanbot || forceResponse || Math.random() < RESPONSE_CHANCE) {
                HumanResponder.respondToIm(message);
                if (IAN_GUILDS.indexOf(message.guildId || "") != -1) {
                    HumanResponder.respondToTess(message);
                    HumanResponder.respondToScreens(message);
                    HumanResponder.respondToEr(message);
                }    
            }
        }
    }
}

export default MessageResponder;