const Discord = require('discord.js')
const { IdOwner } = require('../botconfig.js')
const db = require('quick.db')

exports.run = async (bot, message, args) => {

   if(message.author.id !== IdOwner) return;

      if(!args.join(' ')) return message.channel.send(`Escriba el estado.`);
    
   bot.user.setPresence({
          status: "dnd",
          activity: {
            name: args.join(' '),
            type: 1,
            url: "https://www.twitch.tv/toxictoxd"
          }
        })
    const embed = new Discord.MessageEmbed()
    
    .addField("Cambiando mi estado a ", "<a:Streaming:446126986482417676>Streaming")
    .addField('Con el jugando:', args.join(' '))
    .setTimestamp()
    .setColor(0x36393e)
    .setThumbnail('https://cdn.discordapp.com/emojis/446126986482417676.gif')
    .setFooter(`SetGame` , bot.user.avatarURL(), true)
    message.channel.send({ embed });
   
}
exports.config = {
  command: "setstream",
  aliases: ['setstream', 'sst']
}