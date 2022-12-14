// @note: USE COMMAND 'npm run dev' IN POWERSHELL TO START THE BOT
// @note: interaction.reply({content: "Only you can see this!", ephemeral: true });
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
		case "activedevbadge":
			interaction.reply({content: "Command run successfully.\nPlease wait up to 24hrs, then go to https://discord.com/developers/active-developer to claim your badge!", ephemeral: true });
			break;
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
			interaction.reply(`User: ${interaction.user.tag}\nID: ${interaction.user.id}\nJoined: ${time(interaction.user.createdAt, "F")}\nAvatar: ${interaction.user.avatarURL()}`);
			break;
		case "token":
			interaction.reply({ content: `Start of your token: ${btoa(interaction.user.id)}\nIf anyone sends you this, do not worry.\nIt is simply your user id encoded in base64.`, ephemeral: true });
		default:
			break;
	}
	console.log(`[${interaction.createdAt.toLocaleDateString("en-AU")} @ ${interaction.createdAt.toLocaleTimeString("en-AU").replace(" ", "")}] COMMAND: '${interaction.commandName}' was used by ${interaction.user.tag} <@${interaction.user.id}>`);
});

async function main() {
	const commands = [
		{
			name: "activedevbadge",
			description: "Replies to only you with a message to claim your Active Developer badge"
		}, {
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
		}, {
			name: "token",
			description: "Replies to only you with the start of your token"
		}
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