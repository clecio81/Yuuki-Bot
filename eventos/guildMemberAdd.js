const { MessageEmbed } = require('discord.js')
exports.run = (client, member) => {
  
   let channelID = client.tools.getWelcomeChannel(member.guild)
   
   var sourceChannel = member.guild.channels.get(channelID)
  if(!sourceChannel) return;
  
 const botUser = member.user.bot
 
  if(member.user.bot) {
  const borole //= client.provider.get(member.guild.id, 'botrole') 
  if (!borole || borole.toLowerCase() === 'none');
        else { 
            try { 
                member.roles.add(member.guild.roles.find(roleU => roleU.name === `${borole}`))
            } catch (e) { 
                console.log("Bot Role: A guild tried to auto-role an invalid role to someone.") 
            }
        }
  var embed = new MessageEmbed()
	    .setAuthor("Bot Joined", 'https://cdn.discordapp.com/emojis/360209976012308494.png')
	    .setColor(0x36393e)
	    .setTimestamp()
	    .setDescription(`The bot ${member.user} (**${member.user.tag}**) has joined the server\nThere are now **${member.guild.members.size}** users within this server!`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter(member.guild.name, member.guild.iconURL())
	 return sourceChannel.send({ embed: embed }) 
  }

  const autoRUID = client.provider.get(member.guild.id, 'autorU')  
  if (!autoRUID || autoRUID.toLowerCase() === 'none');
        else { 

            try { 
                member.roles.add(member.guild.roles.find(roleU => roleU.name === `${autoRUID}`))
            } catch (e) { 
                console.log("A guild tried to auto-role an invalid role to someone.") 
            }

        }
let text
 const textjoin = client.provider.get(member.guild.id, 'TextJ')
    if(textjoin === undefined) text = `${member.user} (**${member.user.tag}**) has joined the server\nThere are now **${member.guild.members.size}** users within this server!`
    else text = textjoin.replace('{user:tag}', member.user.tag).replace('{server:membercount}', member.guild.memberCount).replace('{server:name}', member.guild.name).replace('{user:mention}', member.user).replace('{user:username}', member.user.username)

  var embed = new MessageEmbed()
	    .setAuthor("User Joined", 'https://cdn.discordapp.com/emojis/417574812295364609.png')
	    .setColor(0x36393e)
	    .setTimestamp()
	    .setDescription(text)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter(member.guild.name, member.guild.iconURL())
	 return sourceChannel.send({ embed: embed })

}