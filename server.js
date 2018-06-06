//a
const http = require('http');
const express = require('express');
const app = express();

//
app.use(express.static('public'));

app.get("/", function (request, response) {
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
}, 280000);
//DESDE AQUI EMPIEZA A ESCRIBIR EL CODIGO PARA SU BOT
const Discord = require('discord.js');
const fs = require('fs');
const bot = new Discord.Client();
const tools = require('./functions.js');
const db = require('quick.db')


function loadCmds () {
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
}
loadCmds();
function eventsLoad () {
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
}
eventsLoad();

var prefix = 'Yu!';
bot.on('message', message => {
  
 
  
 
  var sender = message.author;
  var msg = message.content.toLowerCase();
  
  var cont = message.content.slice(prefix.length).split(' ');
  var args = cont.slice(1);
  
  if (!message.content.startsWith(prefix)) return;
  
  var cmd = bot.commands.get(cont[0]) || bot.commands.get(bot.aliases.get(cont[0]));
  if (cmd) cmd.run(bot, message, args, tools, loadCmds, eventsLoad);
  

})

//bot.login('MzcwODI5Mzc5Mjc5OTEyOTcx.DdvsgQ.vEjUN5QR04xpa3JmC7dCCZehv4c') Yuuki pruebas token
bot.login('MzY1OTQ5Nzg4ODA3NzU3ODM0.DUwiiw.5XOJyb96StwLoAE_JZxpXNWaclE')
//bot.login('Mzk2NTA1Mjc3MjYxOTM4Njg5.DXgWmw.e1zXkHOcrXJEY3635Pu8-cFWAgQ') //Supreme Bot token
bot.on('channelDelete', async channel => {
  let audit = await tools.fetchLastAudit(channel.guild);
  if (!audit) return;
  if (audit.action !== 'CHANNEL_DELETE') return;
  
  // Push to database
  db.push(`delChannels_${channel.guild.id}`, { target: `#${audit.changes[0].old}`, user: { id: audit.executor.id, tag: `${audit.executor.username}#${audit.executor.discriminator}` }, timestamp: Date.now() })
  
  // Starboard
  let starboard = await db.fetch(`starboard_${channel.guild.id}`)
  if (starboard !== null && starboard.enabled && starboard.channel === channel.id) {
    db.set(`starboard_${channel.guild.id}`, false, { target: '.enabled' }) 
  }
  
  // Check
  
})
