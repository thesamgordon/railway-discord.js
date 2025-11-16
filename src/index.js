require("dotenv").config();

const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const pingCommand = require("./commands/ping.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("clientReady", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const clientId = client.user.id;
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        console.log("Registering slash commands...");

        await rest.put(
            Routes.applicationCommands(clientId),
            {
                body: [
                    pingCommand.data.toJSON()
                ]
            }
        );

        console.log("Slash commands registered.");
    } catch (error) {
        console.error(error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === pingCommand.data.name) {
        return pingCommand.execute(interaction);
    }
});

if (!process.env.TOKEN) {
    console.error("Error: Discord bot token is not defined in environment variables. Set the TOKEN environment variable.");
    process.exit(1);
}

client.login(process.env.TOKEN);
