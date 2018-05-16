const Discord = require('discord.js')

exports.run = async (bot, message, args) => {
let miembro = message.mentions.members.first();
        let role = message.guild.roles.find("name", "Silenciado");
        let perms = message.member.hasPermission("MANAGE_ROLES_OR_PERMISSIONS");
        let razon = args.join(' ');

        if(!perms) return message.channel.send("No tienes el rango requerido para usar este comando.");
        if(message.mentions.users.size < 1) return message.reply("Debes mencionar a alguien para silenciarlo.").catch(console.error);
        if(!role) {
        message.guild.createRole({
      name: 'Silenciado',
      color: '#747474',
      position: 1
         
}).then(role => {
        var canales = message.guild.channels;
        var role = message.guild.roles.find("name", "Silenciado")
        var rol = message.guild.roles.get(role.id);
  
        canales.forEach(k => k.overwritePermissions(rol.id, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            SPEAK: false
        }))
      message.channel.send('Rol **"Silenciado"** no encontrado. El rol fue creado automáticamente.');
      
      if (!razon) {
      miembro.addRole(role).catch(console.error);
      const embed = new Discord.RichEmbed()
        .setTitle(":mute: Usuario silenciado")
        .setDescription(`El usuario **${miembro.user.username}** fue silenciado.`)
        .addField("Razón:", `Sin razón.`)
        .addField("Admin/mod responsable:", `${message.author.username}#${message.author.discriminator}`)
        .setTimestamp()
        .setColor(0xFFB400)
        message.channel.send({embed});
        } else {
      miembro.addRole(role).catch(console.error);
      const embed = new Discord.RichEmbed()
        .setTitle(":mute: Usuario silenciado")
        .setDescription(`El usuario **${miembro.user.username}** fue silenciado.`)
        .addField("Razón:", `${razon}`)
        .addField("Admin/mod responsable:", `${message.author.username}#${message.author.discriminator}`)
        .setTimestamp()
        .setColor(0xFFB400)
        message.channel.send({embed});
      }    
    })
  }
}      
exports.config = {
  command: "mute"
}