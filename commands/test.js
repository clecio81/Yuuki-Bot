const { MessageEmbed } = require('discord.js'),
  db = require('quick.db'),
  ms = require('parse-ms');

exports.run = async (client, message, args, tools) => {
 var langg
 const idioma = await db.fetch(`guildLang_${message.guild.id}`)
 if (idioma === null) langg = 'es'
  else langg = idioma       
  
  const embed = new MessageEmbed()
   .setDescription(`mi lenguaje en este servidor es: **${langg}**` )
message.channel.send(embed)
}
exports.config = {
  command: "test",
  aliases: ["test", "test"],
  category: "beta",
  description: " ",
  usage: " "
};