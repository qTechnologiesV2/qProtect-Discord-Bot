const { SlashCommandBuilder, EmbedBuilder } = require(`@discordjs/builders`);

module.exports = {
    name: `config`,
    data: new SlashCommandBuilder()
        .setName(`config`)
        .setDescription(`config`),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()

        embed.setColor(0x210ecc)
            .setTitle("QProtect Bot | Config")
            .setDescription("> Do not change the input or output settings, it will cause issues and will not obfuscate your file.")

            .setFooter({ text: 'QProtect Bot by aSwitch', iconURL: `https://mdma.dev/data/assets/logo/Icon.png` })
            .setThumbnail("https://mdma.dev/data/assets/logo/Icon.png")
            .setTimestamp()

        await interaction.reply({ embeds: [embed], files: [`./config.yml`] })
    },
}

