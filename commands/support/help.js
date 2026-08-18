const { SlashCommandBuilder, EmbedBuilder } = require(`@discordjs/builders`);

module.exports = {
    name: `help`,
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`help`),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()

        embed.setColor(0x2a5aeb)
            .setTitle("Bot Support")
            .setDescription("QProtect bot is a **free open source** discord bot created by aSwitch to make obfuscating files easier.")
            .addFields({ name: "Bot Support", value: "> [Click Here](https://discord.gg/A9WnStj8Ha)", inline: true })
            .addFields({ name: "Github", value: "> [Click Here](https://github.com/qTechnologiesV2/qProtect-Discord-Bot)", inline: true })
            .addFields({ name: "QProtect", value: "> [Click Here](https://qtechnologies.dev/)", inline: true })
            .setFooter({ text: 'QProtect Bot by aSwitch', iconURL: `https://cdn.qtechnologies.dev/icons/56805c87-1695-47d7-af57-954d83b290c6.png` })
            .setThumbnail("https://cdn.qtechnologies.dev/icons/56805c87-1695-47d7-af57-954d83b290c6.png")
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })

    },
}

