const { Client } = require("unb-api");
const Discord = require("discord.js");
const Logger = require("./functions/client/logger");

const { GatewayIntentBits, Partials, Collection } = require("discord.js");

const client = new Discord.Client({
	intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.Message ],
	allowedMentions: {
		repliedUser: true,
	},
});


client.cooldowns = require("./json/cooldowns.json");
client.config = require("./config.json");
client.unbelieva = new Client(client.config.UnbelievaBoatAPI);
client.logger = new Logger();
client.music = new Collection();
client.losy = new Collection();
client.voiceRewards = new Collection();
client.losyArray = []

client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.contexts = new Collection();
client.zagadki = new Collection();
client.polls = new Collection();

Promise.all(
	[
		require("./functions/client/embeds")(client), 
		require("./handler")(client), require("./mongo")(client), 
		client.login(client.config.token)
	]
);
