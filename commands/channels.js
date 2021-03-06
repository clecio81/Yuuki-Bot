const Discord = require('discord.js')
const { fromNow } =  require('../utils/utils.js');
const moment = require('moment');

exports.run = async (bot, message, args) => {
   let somethingThere = message.content.split(/\s+/g).slice(1).join(" ");

                const channelCategory = message.guild.channels.filter(c => c.type === 'category')
                const textChannels = message.guild.channels.filter(c => c.type === 'text')
                const voiceChannels = message.guild.channels.filter(c => c.type === 'voice')

                const sortPos = (a, b) => a.position - b.position;

                if (!somethingThere) {
                    const hasPerm = (c, perms) => c.permissionsFor(message.member).has(perms)
                    const f = t => ` **\`[${t}]\`**`
                    const displayPerms = c => `${!hasPerm(c, 'SEND_MESSAGES') && c instanceof Discord.TextChannel ? f('NO SEND') : ''}${!hasPerm(c, 'CONNECT') && c instanceof Discord.VoiceChannel ? f('NO CONNECT') : ''}${!hasPerm(c, 'VIEW_CHANNEL') ? f('NO VIEW') : ''}`
                    const isAFK = c => c.id === message.guild.afkChannelID;

                    var description = [].concat(

                            `**❯\u2000\Text channels [${textChannels.size}]:**`,
                            channelCategory.sort(sortPos).map(c => `•\u2000**${c.name}** [${c.children.size}]\n${textChannels.filter(d => d.parentID === c.id).sort(sortPos).map(d => (`#\u2000${d.name}${displayPerms(d)}\n`)).join("")}`),
                textChannels.filter(e => e.parentID === null || e.parentID === undefined).sort(sortPos).map(c => c ? `#\u2000${c.name}${displayPerms(c)}` : ""),

                `**❯\u2000\Voice channels [${voiceChannels.size}]:**`,

                voiceChannels.sort(sortPos).map(c => `•\u2000${c.name}${displayPerms(c)}${isAFK(c) ? ' **`[AFK]`**' : ''}`)

            );

            if(!description.length > 1024 ) return message.channel.send('Too much channels in this server! I couldn\'t send the information!');            

            const embed = new Discord.MessageEmbed()
                .setAuthor(`Channels in ${message.guild.name} [${message.guild.channels.size}]`, message.guild.iconURL())
                .setDescription(`${description.length > 1024 ?  "Too much channels in this server! I couldn\'t send the information!" : description}`)
                .setThumbnail(message.guild.iconURL())
                .setFooter(`Permissions shown for ${message.author.tag}`, message.author.displayAvatarURL())
                .setColor('#8B9EB7');
            return message.channel.send({ embed });
        }

        var  channel = message.mentions.channels.first()

        const embed = new Discord.MessageEmbed()
            .setAuthor(channel.name, message.guild.iconURL())
            .setDescription(`•\u2000${channel.topic ? channel.topic : '`No Topic`'}`)
            .setThumbnail(message.guild.iconURL())
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor('#846B86')
            .addField('❯\u2000\Information', `•\u2000\**ID:** ${channel.id}\n\•\u2000\**Category:** ${channel.parent ? channel.parent : 'None'}\n\•\u2000\**Created:** ${moment(channel.createdAt).format('MMMM Do YYYY')} \`(${fromNow(channel.createdAt)})\``, true)
            .addField('❯\u2000\Miscellaneous', `•\u2000\**NSFW:** ${channel.nsfw ? "Yes" : "No"}\n\•\u2000\**Matching Permissions:** ${channel.permissionsLocked ? "Yes" : "No"}`, true)
        return message.channel.send({ embed });
    }
exports.config = {
  command: "channels",
  aliases: ["channels", "channelsize"],
  category: "info",
  description: "Te manda la lista de canalales del servidor",
  usage: "Yu!channels"
};