const {Client, GatewayIntentBits, Collection, MessageEmbed} = require(`discord.js`);
const fs = require("fs");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

const { token, prefix } = require("./resources/config.json");

const functionFiles = fs.readdirSync("./functions/").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");


(async () => {

    for (const file of functionFiles) {
        require(`./functions/${file}`)(client);
    }

    client.handleEvents(eventFiles, "./events");
    client.handleCommands(commandFolders, "./commands");
    await client.login(token);
})();
