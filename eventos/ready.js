const Discord = require('discord.js')
const prefix = 'Yu!'
exports.run = (client, guild, args) => {

	console.log('Bot launched...')


	/*setTimeout(() => {
		system.post.datadog();
	}, 30000);

	setInterval(() => {
		system.updateGuild();
		system.log("Stats send to bots list", "debug")
    }, 1800000);
*/
	function rotateGames(i) {
			let games = [
				` ¿Necesita ayuda? Yu!help`,
				` with ${client.options.author}`,
				` en ${client.guilds.size} servers`
			];

			if(i >= games.length) i = 0;
			client.user.setPresence({
				status: "dnd",
				game: {
					name: games[i],
					type: "PLAYING"
				}
			});
	

		setTimeout(() => {
			rotateGames(++i);
		}, 10000);
	}
	rotateGames(0);
};