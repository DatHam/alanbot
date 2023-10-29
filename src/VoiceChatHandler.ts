import { VoiceBasedChannel } from 'discord.js';
import { VoiceConnection, joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';

import Logger from './Logger';

class VoiceChatHandler {
    joinVC = (voiceChannel: VoiceBasedChannel, joinMuted: boolean, joinDefened: boolean) => {
        getVoiceConnection(voiceChannel.guildId)?.destroy();

        const voiceConnection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guildId,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfMute: joinMuted,
            selfDeaf: joinDefened,
        });

        Logger.logVC(voiceChannel, `join ${joinMuted ? "mute" : "unmute"} ${joinDefened ? "deaf" : "undeaf"}`)

        voiceConnection.on("stateChange", (oldState, newState) => {
            Logger.logVC(voiceChannel, `${oldState.status} > ${newState.status}`);
        });

        return voiceConnection;
    };

    leaveVC = (voiceChannel: VoiceBasedChannel) => {
        if (getVoiceConnection(voiceChannel.guildId) == undefined) {
            this.joinVC(voiceChannel, true, true).destroy();
        } else {
            getVoiceConnection(voiceChannel.guildId)?.destroy();
        }
    };
}


export default new VoiceChatHandler();