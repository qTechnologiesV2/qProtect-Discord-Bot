const { EmbedBuilder } = require(`@discordjs/builders`);

module.exports = {
    name: `interactionCreate`,
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        // console.log(interaction.commandName)

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.log("not a command")
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.log(error);

            const embed = new EmbedBuilder()
                .setColor(0x210ecc)
                .setDescription("Oh no something went wrong!")

            await interaction.reply({ embed: [embed], ephemeral: true });
        }








    }
}