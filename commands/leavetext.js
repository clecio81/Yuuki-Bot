const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
exports.run = async (bot, message, args) => {
  
   const perms = bot.options.owner.includes(message.author.id) || message.member.hasPermission('ADMINISTRATOR') 
   
  let prefix = await bot.tools.GuildPrefix(message.guild)
  
    if (!perms) return  bot.tools.embed(message.channel, '**This command requires the Administrator role**') 
    
  if (!args.join(" ") && args.join(" ").toUpperCase() !== 'NONE') { 
    
    const textjoin = await bot.tools.welcomeText(message.guild) 
    
      const embed = new MessageEmbed()
        .setTitle('El texto de salida actual es el siguiente')
        .setDescription(textjoin)
        .addField('Ajustes',`{server:name} = ${message.guild.name}\n{server:membercount} = ${message.guild.members.size} members\n{user:mention} = ${message.member.user}\n{user:username} = ${message.member.user.username}\n{user:tag} = ${message.member.user.tag}`)
        .setFooter(`Para cambiar el texto usa ${prefix}welcometext <su mensaje>`) 
        .setThumbnail()
      message.channel.send({embed})
    return;
   }
    let newMessage;
    if (args.join(" ").toUpperCase() === 'NONE') newMessage = ''; 
    else newMessage = args.join(" ").trim(); 

    db.set(`leaveMessage_${message.guild.id}`, newMessage).then(i => {
           
       const embed = new MessageEmbed()
        .setTitle('Texto de salida actualizado con éxito a')
        .setDescription(i)
        //.addField('Ajustes',`{server:name} = ${message.guild.name}\n{server:membercount} = ${message.guild.members.size} members\n{user:mention} = ${message.member.user}\n{user:username} = ${message.member.user.username}\n{user:tag} = ${message.member.user.tag}`)
        .setThumbnail()
      message.channel.send({embed})
    })

}
exports.config = {
  command: "wleavetext",
  aliases: ["ltext", "setltext", "leavetextset"],
  category: "mod",
  description: " ",
  usage: " "
};