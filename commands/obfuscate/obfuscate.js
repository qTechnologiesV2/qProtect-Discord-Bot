const { SlashCommandBuilder, EmbedBuilder } = require(`@discordjs/builders`);
const https = require(`https`);
const { exec } = require('child_process');
const fs = require(`fs`);

const YAML = require('yaml')

let running = false;
let error = false;


const watermark = `𝗤𝗣𝗿𝗼𝘁𝗲𝗰𝘁 𝗢𝗯𝗳𝘂𝘀𝗰𝗮𝘁𝗼𝗿 𝗖𝗼𝗻𝘀𝗼𝗹𝗲\n\n`

async function download(url, filename) {
    return new Promise(resolve => {
        https.get(url, (res) => {
            const writeStream = fs.createWriteStream(`tmp/` + filename);
            res.pipe(writeStream);

            writeStream.on(`finish`, () => {
                writeStream.close();
                resolve();
            })
        })
    })
}

async function obfuscate(config) {
    if (config) {
        return new Promise(resolve => {
            var child = exec('java -jar QProtect.jar --config ./tmp/config.yml');
            child.on('close', function (code) {
                resolve();
            });
        })
    }

    return new Promise(resolve => {
        var child = exec('java -jar QProtect.jar --config config.yml');
        child.on('close', function (code) {
            resolve();
        });
    })

}

let console_log = ``;

async function discord_log(message, interaction, percentage) {



    const embed = new EmbedBuilder()
        .setTitle(`${watermark}`)
        .setColor(0x210ecc)
        .setFooter({ text: 'QProtect Bot by aSwitch', iconURL: `https://mdma.dev/data/assets/logo/Icon.png` })
        .setTimestamp()

    console_log += `-> ` + message + `\n`;
    embed.setDescription("```" + console_log + "```");
    await interaction.editReply({ embeds: [embed] });
}


function delete_tmp_files(interaction) {
    discord_log(`Deleting Files...`, interaction);
    try {
        if (fs.existsSync(`./tmp/input.jar`)) {
            fs.unlinkSync(`./tmp/input.jar`);
        }

        if (fs.existsSync(`./tmp/output.jar`)) {
            fs.unlinkSync(`./tmp/output.jar`);
        }

        if (fs.existsSync(`./tmp/config.yml`)) {
            fs.unlinkSync(`./tmp/config.yml`);
        }
    } catch (err) {
        console.log(err)
    }
    discord_log(`Deleted Files!`, interaction);
}

let lastObfuscate;

module.exports = {
    name: `obfuscate`,
    data: new SlashCommandBuilder()
        .setName(`obfuscate`)
        .setDescription(`Obfuscate a small jar file.`)
        .addAttachmentOption((option) => option
            .setRequired(true)
            .setName(`jar`)
            .setDescription(`The jar file you wish to obfuscate.`))
        .addAttachmentOption((option) => option
            .setName("config")
            .setDescription("Your custom Qprotect Lite config.")
        ),
    async execute(interaction, client) {

        await interaction.deferReply({
            fetchReply: false
        });

        const embed = new EmbedBuilder()
            .setTitle(`${watermark}`)
            .setColor(0x210ecc)
            .setFooter({ text: 'QProtect Bot by aSwitch', iconURL: `https://mdma.dev/data/assets/logo/Icon.png` })
            .setTimestamp()



        /**
         * Checking if the bot is trying to obfuscate a file already.
         */
        if (running) {
            if (new Date().getTime() - lastObfuscate > 15000) {
                running = false;
                delete_tmp_files(interaction)
            } else {
                embed.setDescription(`> Only one file can be obfuscated at a time.`)
                await interaction.editReply({ embeds: [embed] });
                return;
            }
        } else {
            running = true;
        }

        lastObfuscate = new Date().getTime();


        const file = interaction.options.getAttachment('jar')
        const config = interaction.options.getAttachment('config')

        /**
         * Downloading the input.jar file
         */

        discord_log(`Downloading File...`, interaction);
        await download(file.url, `input.jar`)
        discord_log(`Downloaded File!`, interaction);


        /**
         * Downloading the custom config and pre checking the config.
         */

        if (config) {
            discord_log(`Downloading Config...`, interaction);
            await download(config.url, `config.yml`)
            discord_log(`Downloaded Config!`, interaction);

            discord_log(`Checking Custom Config...`, interaction);

            try {
                const config_file = fs.readFileSync(`./tmp/config.yml`, 'utf8');
                const yaml_config = YAML.parse(config_file);

                if (yaml_config.file.input !== "./tmp/input.jar") {
                    discord_log("Custom Config Failed! Set the \"input\" value to ./tmp/input.jar inside your config", interaction);
                    delete_tmp_files(interaction)
                    running = false;
                    console_log = ``;
                    return;
                }

                if (yaml_config.file.output !== "./tmp/output.jar") {
                    discord_log("Custom Config Failed! Set the \"output\" value to ./tmp/output.jar inside your config", interaction);
                    delete_tmp_files(interaction)
                    running = false;
                    console_log = ``;
                    return;
                }

                discord_log(`Custom Config Passed!`, interaction);
            } catch (error) {
                discord_log(`Detected Invalid Config!`, interaction);
                delete_tmp_files(interaction)
                running = false;
                console_log = ``;
                return;
            }
        }



        /**
         * Obfuscating the input.jar file.
         */

        discord_log(`Obfuscating File...`, interaction);
        await obfuscate(config)
        discord_log(`Obfuscated File!`, interaction);

        /**
         * Sending the obfuscated file into the chat
         */
        await interaction.editReply({ files: [`./tmp/output.jar`] });

        /**
         * Deleting all tmp files
         */
        delete_tmp_files(interaction)


        console_log = ``;
        running = false;
    },
}

