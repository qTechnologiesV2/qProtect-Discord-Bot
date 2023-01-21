const { SlashCommandBuilder, EmbedBuilder } = require(`@discordjs/builders`);

module.exports = {
    name: `help`,
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`help`),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()

        embed.setColor(0x210ecc)
            .setTitle("QProtect Bot | Support")
            .setDescription("> QProtect bot is a free open source discord bot created by aSwitch to make obfuscating files easier.")

            .addFields({ name: "Bot Support", value: "> [Click Here](https://discord.gg/A9WnStj8Ha)", inline: true })
            .addFields({ name: "QProtect Support", value: "> [Click Here](https://discord.gg/PYwYGxVJcb)", inline: true })
            .addFields({ name: "Github", value: "> [Click Here](https://github.com/qTechnologiesV2/qProtect-Discord-Bot)", inline: true })
            .setFooter({ text: 'QProtect Bot by aSwitch', iconURL: `https://mdma.dev/data/assets/logo/Icon.png` })
            .setThumbnail("https://mdma.dev/data/assets/logo/Icon.png")
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })

    },
}

