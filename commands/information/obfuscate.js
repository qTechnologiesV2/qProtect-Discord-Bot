const { SlashCommandBuilder, EmbedBuilder  } = require(`@discordjs/builders`);
const https = require("https");
const exec = require('child_process').exec;
const fs = require("fs");

let running = false;


const watermark = "𝗤𝗣𝗿𝗼𝘁𝗲𝗰𝘁 𝗢𝗯𝗳𝘂𝘀𝗰𝗮𝘁𝗼𝗿 𝗖𝗼𝗻𝘀𝗼𝗹𝗲\n\n"

async function download(url, filename) {
    return new Promise(resolve => {
        https.get(url, (res) => {
            const writeStream = fs.createWriteStream("tmp/" + filename);
            res.pipe(writeStream);
         
            writeStream.on("finish", () => {
               writeStream.close();
               resolve();
            })
         })
    })
}

async function obfuscate() {
    return new Promise(resolve => {
        var child = exec('java -jar QProtect.jar --config config.yml');
        child.on('close', function(code) {
            resolve();
        });
    })
}

let console = "";

async function discord_log(message, interaction) {
    const embed = new EmbedBuilder()
    .setTitle("QProtect Obfuscator")
    .setColor(0x210ecc)

    console += "-> "+ message + "\n";
    embed.setDescription("```" + console + "```")
    await interaction.editReply({ embeds: [embed]});
}

module.exports = {
    name: "obfuscate",
    data: new SlashCommandBuilder()
        .setName("obfuscate")
        .setDescription("Obfuscate a small jar file.")
        .addAttachmentOption((option)=> option
            .setRequired(true)
            .setName("jar")
            .setDescription("The jar file you wish to obfuscate.")),
    async execute(interaction) {

        await interaction.deferReply({
            fetchReply: true
        });

        const embed = new EmbedBuilder()
        .setTitle("QProtect Obfuscator")
        .setColor(0x210ecc)

        if (running) {
            embed.setDescription("> Only one file can be obfuscated at a time.")
            await interaction.editReply({ embeds: [embed]});
            return;
        } else {
            running = true;
        }

        console += watermark;


        const file = interaction.options.getAttachment('jar')
        discord_log("Downloading File...", interaction);
        await download(file.url, "input.jar")
        discord_log("Downloaded File!", interaction);

        discord_log("Obfuscating File...", interaction);
        await obfuscate()
        discord_log("Obfuscation Complete", interaction);

        await interaction.editReply({ embeds: [embed], files: ["./tmp/output.jar"]});

        discord_log("Deleting Files...", interaction);
        await interaction.editReply({ embeds: [embed]});

        try {
            fs.unlinkSync("./tmp/input.jar");
            fs.unlinkSync("./tmp/output.jar");

            discord_log("Deleted Files!", interaction);
        } catch (err) {
            discord_log(err);
        } 


        console = "";

        running = false;
    },
}

