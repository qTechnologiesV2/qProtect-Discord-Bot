const { Client, GatewayIntentBits, Collection, MessageEmbed } = require(`discord.js`);
const fs = require("fs");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});
var { token, clientId } = require("./resources/config.json");
const prompt = require('prompt-sync')();

client.log = (message) => {
    console.log(`[QProtect]: ${message}`);
}

// Creating tmp folder if it doesnt exist.
if (!fs.existsSync("./tmp")) {
    client.log("Creating tmp folder...")
    fs.mkdirSync("./tmp");
    client.log("Created tmp folder!")
}

if (token == "") {
    client.log("Missing bot token. Please enter your bot token.")
    token = prompt("Token =>")
    const data = {
        "token": `${token}`,
        "clientId": `${clientId}`
    };

    fs.writeFileSync('./resources/config.json', JSON.stringify(data));
    client.log("Setted up your bot's token!")
}

if (clientId == "") {
    client.log("Missing bot token. Please enter your bot clientId.")
    clientId = prompt("ClientID =>")
    const data = {
        "token": `${token}`,
        "clientId": `${clientId}`
    };
    fs.writeFileSync('./resources/config.json', JSON.stringify(data));
    client.log("Setted up your bot's clientId!")
}

client.token = token;
client.clientId = clientId;

client.commands = new Collection();

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
