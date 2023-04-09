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

/**
 * Checks for a valid config containing both the token and client id
 */

if (!token || !clientId) {
    client.log("Detected an invalid config file.")
    client.log("Fixing ./resources/config.yml...")
    const data = {
        "token": "",
        "clientId": ""
    };
    fs.writeFileSync('./resources/config.json', JSON.stringify(data));
    client.log("Fixed ./resources/config.yml")
    return;
}

// Creating tmp folder if it doesnt exist.
if (!fs.existsSync("./tmp")) {
    client.log("Creating tmp folder...")
    fs.mkdirSync("./tmp");
    client.log("Created tmp folder!")
}

// If the token is misisng, it will request it
if (token == "") {
    client.log("Missing bot token. Please enter your bot's token.")
    token = prompt("Token =>")
    const data = {
        "token": `${token}`,
        "clientId": `${clientId}`
    };

    fs.writeFileSync('./resources/config.json', JSON.stringify(data));
    client.log("Token has been set!")
}

// If the client is misisng, it will request it
if (clientId == "") {
    client.log("Missing client Id. Please enter your bot's client Id.")
    clientId = prompt("Client ID =>")
    const data = {
        "token": `${token}`,
        "clientId": `${clientId}`
    };
    fs.writeFileSync('./resources/config.json', JSON.stringify(data));
    client.log("ClientId has been set!")
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
