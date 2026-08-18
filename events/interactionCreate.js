const { EmbedBuilder } = require(`@discordjs/builders`);

module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.log("not a command")
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.log(error);
        }

    }
}