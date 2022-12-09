// @note: USE COMMAND 'npm run dev' IN POWERSHELL TO START THE BOT
// @note: https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-interactionCreate
import { config } from "dotenv";
import { Client, GatewayIntentBits, InteractionResponse, Routes, time, inlineCode, codeBlock, blockQuote } from "discord.js";
import { REST } from "@discordjs/rest";

config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	] // previously "Guilds", "GuildMessages"
});
const rest = new REST({ version: "10" }).setToken(TOKEN);

client.on("ready", () => {
	const userStatus = {"activity": "trying to make this work",
						"status": "dnd"}; // types: online, idle, invisible, dnd
	client.user.setPresence({ activities: [{ name: userStatus.activity }], status: userStatus.status });
	console.log(`Logged in as ${client.user.tag} with activity '${userStatus.activity}'!`);
});

client.on("interactionCreate", (interaction) => { // https://discord.js.org/#/docs/discord.js/main/class/CommandInteraction
	if (!interaction.isCommand()) return;
	switch (interaction.commandName) {
		case "test":
			interaction.reply(`**<@${interaction.user.id}>**, I am sentient and I understand the meaning of life\n *- Locale: ${interaction.locale} | Time: ${time(interaction.createdAt, "T")}*`);
			//interaction.reply(inlineCode(`Interaction: ${interaction.id} | User: ${interaction.user.id}`));
			break;
		case "inlinetest":
			interaction.reply(inlineCode(`${interaction.options.get("text").value}`));
			break;
		case "hello":
			interaction.reply(`Hello **${interaction.user.tag}**!`);
			break;
		case "ping":
			interaction.reply(`Pong!\n${codeBlock("Client: " + client.ws.ping + "ms\nAPI: " + (Date.now() - interaction.createdTimestamp) + "ms")}`);
			break;
		case "user":
			interaction.reply(`User: ${interaction.user.tag}\nID: ${interaction.user.id}\nJoined: ${time(interaction.user.createdAt, "F")}\nToken Start: ${btoa(interaction.user.id)}\nAvatar: ${interaction.user.avatarURL()}`);
			break;
		default:
			break;
	}
	console.log(`[${interaction.createdAt.toLocaleDateString("en-AU")} @ ${interaction.createdAt.toLocaleTimeString("en-AU").replace(" ", "")}] COMMAND: '${interaction.commandName}' was used by ${interaction.user.tag} <@${interaction.user.id}>`);
});

async function main() {
	const commands = [
		{
			name: "test",
			description: "Replies with '*name*, I am sentient.' if the bot is working",
		}, {
			name: "inlinetest",
			description: "Replies with an inline version of the text you input",
			options: [
				{
					name: "text",
					description: "The text you want to be inlined",
					type: 3,
					required: true,
				}
			]
		}, {
			name: "hello",
			description: "Replies with 'Hello *name*!'",
		}, {
			name: "ping",
			description: "Replies with the client and API ping",
		}, {
			name: "user",
			description: "Replies with your user information",
		},
	];

	try {
		console.log("Started refreshing application (/) commands.");
		await rest.put(Routes.applicationCommands(CLIENT_ID), {
			body: commands,
		});
		client.login(TOKEN);
	} catch (err) {
		console.log(err);
	}
}


main();