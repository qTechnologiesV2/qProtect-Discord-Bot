module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`${client.user.username} is online`)

        client.user.setPresence({ activities: [{ name: 'QProtect file obfuscator' }] });
            

    }
}