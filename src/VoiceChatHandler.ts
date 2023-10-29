import { VoiceBasedChannel } from 'discord.js';
import { VoiceConnection, joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

import Logger from './Logger';

class VoiceChatHandler {
    joinVC = (voiceChannel: VoiceBasedChannel) => {
        getVoiceConnection(voiceChannel.guildId)?.destroy();

        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        voiceConnection.on("stateChange", (oldState, newState) => {
            Logger.logVC(voiceChannel, `${oldState.status} > ${newState.status}`);
        });

        return voiceConnection;
    };

    leaveVC = (voiceChannel: VoiceBasedChannel) => {
        if (getVoiceConnection(voiceChannel.guildId) == undefined) {
            this.joinVC(voiceChannel).destroy();
        } else {
            getVoiceConnection(voiceChannel.guildId)?.destroy();
        }
    };
}


export default new VoiceChatHandler();