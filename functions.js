const db = require('quick.db');
const Discord = require('discord.js');
const ms = require('parse-ms');
const exec = require('child_process').exec;
const { MessageEmbed } = require('discord.js');
const bot = require('./yuuki.js').bot
const fs = require('fs')
var request = require("request");


module.exports = { 
  
    hook: function(channel, title, message, color, avatar) { 

        if (!channel) return console.log('Channel not specified.');
        if (!title) return console.log('Title not specified.');
        if (!message) return console.log('Message not specified.');
        if (!color) color = '0x36393e'; 
        if (!avatar) avatar = 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png' 
      
        color = color.replace(/\s/g, '');
        avatar = avatar.replace(/\s/g, '');

        channel.fetchWebhooks() 
            .then(webhook => {

                let foundHook = webhook.find(hook => hook.name ==='Webhook'); 

                if (!foundHook) {
                    channel.createWebhook('Webhook', 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png') // Make sure this is the same thing for when you search for the webhook. The png image will be the default image seen under the channel. Change it to whatever you want.
                        .then(webhook => {
                            
                            webhook.send('', {
                                "username": title,
                                "avatarURL": avatar,
                                "embeds": [{
                                    "color": parseInt(`0x${color}`),
                                    "description":message
                                }]
                            })
                                .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                                    console.log(error);
                                    return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                                })
                        })
                } else { // That webhook was only for if it couldn't find the original webhook
                    foundHook.send('', { // This means you can just copy and paste the webhook & catch part.
                        "username": title,
                        "avatarURL": avatar,
                        "embeds": [{
                            "color": parseInt(`0x${color}`),
                            "description":message
                        }]
                    })
                        .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                            console.log(error);
                            return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                        })
                    }

            })

    },
  
    embed: function(channel, message, timer) {
      channel = channel.channel || channel;
      channel.send({embed:{
        title: message,
        color: 0xC85C5C
      }}).then(msg => {
        if (!isNaN(timer)) {msg.delete({timeout: timer})};
      })
    },
  
    getUser: function(message, search) {
	let members = message.guild.members.filter(member => {
		if(member.user.username.toLowerCase().includes(search.toLowerCase())) return true;
		if(member.nickname && member.nickname.toLowerCase().includes(search.toLowerCase())) return true;
		if(member.id === search) return true;
		return false;
	});

	if(members.last()) return members.last();
	return false;
},
    
    parseTime: function(milliseconds) {
      var string = '';
      var obj = ms(Date.now() - milliseconds);
      if (obj.days === 1) string += ` ${obj.days} day `
      else if (obj.days > 1) string += ` ${obj.days} days `
      if (obj.hours === 1) string += `${obj.hours} hour `
      else if (obj.hours > 1) string += `${obj.hours} hours `
      if (obj.minutes === 1) string += `${obj.minutes} minute `
      else if (obj.minutes > 1) string += `${obj.minutes} minutes `
      if (string === '') string = 'Just now'
      else string += 'ago'
      return string;
    },
  
    fetchLastAudit: function(guild, type) {
      const getInfo = new Promise((resolve, error) => {
          if (type) {
            guild.fetchAuditLogs({limit: 1, type: type}).then(item => {
              resolve(item.entries.first())
            })
          } else {
            guild.fetchAuditLogs({limit: 1}).then(item => {
              resolve(item.entries.first())
            })
          }
      });
      return getInfo; 
    },
  
    resp: function(channel, message, timer) {
      channel = channel.channel || channel;
      channel.send({embed:{
        description: message,
        color: 0xC85C5C
      }}).then(msg => {
        if (!isNaN(timer)) {msg.delete({timeout: timer})};
      })
    },
  
    getInfo: function() {
        let client = this;

        let info = {};

        return new Promise((fulfill, reject) => {
            function getVersion() {
                exec('git rev-parse --short=4 HEAD', function (error, version) {
                    if (error) {
                        client.logger.error(`Error getting version ${error}`);
                        info.version = 'unknown';
                    } else {
                        info.version = version.trim();
                    }

                    getMessage();
                });
            }

            function getMessage() {
                exec('git log -1 --pretty=%B', function (error, message) {
                    if (error) {
                        client.logger.error(`Error getting commit message ${error}`);
                        info.message = "Could not get last commit message.";
                    } else {
                        info.message = message.trim();
                    }

                    getTimestamp();
                });
            }

            function getTimestamp() {
                exec('git log -1 --date=short --pretty=format:%ci', function (error, timestamp) {
                    if (error) {
                        client.logger.error(`Error getting creation time ${error}`);
                        info.timestamp = "Not available";
                    } else {
                        info.timestamp = timestamp;
                    }

                    fulfill(info);
                });
            }

            getVersion();
        });
    },
  
    loadCmds: function(bot) {
bot.commands = new Discord.Collection();  
bot.aliases = new Discord.Collection();
bot.events = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  
  var jsfiles = files.filter(f => f.split('.').pop() === 'js'); 
  if (jsfiles.length <= 0) { return console.log('No commands Found') }
  else { console.log('Un total de ' + jsfiles.length + ' Comandos cargados') }
  
  jsfiles.forEach((f, i) => {
    delete require.cache[require.resolve(`./commands/${f}`)]; 
    var cmds = require (`./commands/${f}`);
    //console.log(`Command ${f} loading...`);
    bot.commands.set(cmds.config.command, cmds);
    cmds.config.aliases.forEach(alias => {
	      bot.aliases.set(alias, cmds.config.command);
	    });
    })
  })
},
  
    eventsLoad: function(bot) {
fs.readdir('./eventos/', async (err, files) => {
    if (err) return console.error(err);
    const jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
        return console.log('[eventos] No hay eventos para cargar');
    } else {
        console.log(`Cargando un total de ${jsfiles.length} eventos!`);
    }
    files.forEach(file => {
        let eventFunction = require(`./eventos/${file}`);
        let eventName = file.split('.')[0];
      if(!eventFunction.run) return;
      let run = eventFunction.run.bind(null, bot);
        bot.events.set(eventName, run);
        
        bot.on(eventName, run);
      });
  });
},
  
    getLang: async function(channel, guild, idioma) {
     var langg
    idioma = await db.fetch(`guildLang_${guild.id}`)
     if (idioma === null) langg = 'en'
     else langg = idioma
    const lang = require(`./langs/${langg}.json`) 
    
    channel = channel.channel || channel;

    const embed = new MessageEmbed()
      .setTitle('awa')
      .setDescription(`${lang.func.actual[0]} **${guild.name}** ${lang.func.actual[1]} **${lang.langu.name}**`)
      .setColor(0xfcc7fb);
    channel.send({embed});

  },
   
    Lang: async function(guild) {
     var langg
     var idioma = await db.fetch(`guildLang_${guild.id}`)
     if (idioma === null) langg = 'en'
     else langg = idioma
    const lang = require(`./langs/${langg}.json`) 
    
    return langg
  },

    langU: async function(channel, guild, newLang) {

  db.set(`guildLang_${guild.id}`, newLang)
  
  var langg
  const idioma2 = await db.fetch(`guildLang_${guild.id}`)
  if (idioma2 === null) langg = 'es'
  else langg = idioma2
  
   const lang = require(`./langs/${langg}.json`) 
    const embed = new MessageEmbed()
      .setTitle(lang.titleComp + ' '+ lang.lang.langUpdate)
      .setDescription(lang.lang.translate)
      .setColor(0xfcc7fb);
    channel.send({embed});

  },
  
    GuildPrefix: async function(guild) {
     var prefix
     var prefijo = await db.fetch(`guildPrefix_${guild.id}`)

     if (prefijo === null) prefix = 'Yu!'
     else prefix = prefijo

    return prefix
  },
  
    GetGuildPrefix: async function(channel, guild) {
     var prefix

     var prefijo = await db.fetch(`guildPrefix_${guild.id}`)
     if (prefijo === null) prefix = 'Yu!'
     else prefix = prefijo
    
    var langg,
    idioma = await db.fetch(`guildLang_${guild.id}`)
     if (idioma === null) langg = 'en'
     else langg = idioma
    const lang = require(`./langs/${langg}.json`) 
    
    channel = channel.channel || channel;
    
    const embed = new MessageEmbed()
      .setTitle(lang.prefix.title)
      .setDescription(lang.func.prefix.replace('${prefix}', prefix).replace('${guild.name}', guild.name))
      .setColor(0xfcc7fb);
    channel.send({embed});

  },
  
    UpdateGuildPrefix: async function(channel, guild, newPrefix) {

  channel = channel.channel || channel;

     db.set(`guildPrefix_${guild.id}`, newPrefix)
  
  var langg
  const idioma2 = await db.fetch(`guildLang_${guild.id}`)
  if (idioma2 === null) langg = 'es'
  else langg = idioma2
  
   const lang = require(`./langs/${langg}.json`) 
   const prefix = newPrefix

    const embed = new MessageEmbed()
      .setTitle(lang.titleComp + ' '+ lang.prefix.prefixUpdate)
      .setDescription(lang.prefix.translate.replace('${prefix}', prefix).replace('${prefix}', prefix).replace('${guild.name}', guild.name))
      .setColor(0xfcc7fb);

    channel.send({embed});
  }, 
  
    getLogsChannel: async function(guild) {
    var Canal
    const Lchannel = await db.fetch(`messageChannel_${guild.id}`)
    if (Lchannel === null) Canal = '**<:off:442082928323985408>  Not set**'
     else Canal = Lchannel
    return Canal
  }, 
  
    getWelcomeChannel: async function(guild) {
    var canal
    const channel = await db.fetch(`welcomeChannel_${guild.id}`)
    if (channel === null) canal = '**<:off:442082928323985408>  Not set**'
     else canal = channel
    return canal
  }, 
  
    autoRoleUsers: async function(guild) {
    var role
    const rolename = await db.fetch(`autoRoleU_${guild.id}`)
    if (rolename === null) role = '**<:off:442082928323985408>  Not set**'
     else role = rolename
    return role
  },
  
    autoRoleBots: async function(guild) {
    var role
    const rolename = await db.fetch(`autoRoleB_${guild.id}`)
    if (rolename === null) role = '**<:off:442082928323985408>  Not set**'
     else role = rolename
    return role
  },
  
    welcomeText: async function(guild) {  
    var text
    const rolename = await db.fetch(`joinMessage_${guild.id}`)
    if (rolename === null) text = 'No Habilitado/Not Enabled'//'Bienvenido **{user:tag}** a **{server:name}** ya somos un total de **{server:membercount} de miembros*** en el servidor'
     else text = rolename
    return text
  },
  
    leaveText: async function(guild) {  
    var text
    const texto = await db.fetch(`leaveMessage_${guild.id}`)
    if (texto === null) text = 'No Habilitado/Not Enabled'//'Good bye, **{user:tag}** You are now leaving **{server:name}**!'
     else text = texto
    return text
  }
  
}