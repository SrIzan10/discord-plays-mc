import * as colorette from "colorette";
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import inventoryViewer from "mineflayer-web-inventory";
import "dotenv/config";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
const bot = mineflayer.createBot({
	host: process.env.MC_HOST,
	username: "TheBot",
	// port: 24311,
	version: "1.18.2",
});

let stopResponses: boolean = false

client.on("messageCreate", async (message) => {
	if (message.author.id === client.user!.id) return
	if (
		message.channel.id !== "1057648908630757426" &&
		message.channel.id !== "1057744953545072710"
	) return;

	if (stopResponses !== true) {
		const items = bot.inventory.items().map((item) => {
			return item.displayName;
		});
		let entity;
		switch (message.content) {
			case "hold w":
				bot.setControlState("forward", true);
				break;
			case "hold s":
				bot.setControlState("back", true);
				break;
			case "hold a":
				bot.setControlState("left", true);
				break;
			case "hold d":
				bot.setControlState("right", true);
				break;
			case "w":
				bot.setControlState("forward", true);
				setTimeout(function () {
					bot.setControlState("forward", false);
				}, 100);
				break;
			case "s":
				bot.setControlState("back", true);
				setTimeout(function () {
					bot.setControlState("back", false);
				}, 100);
				break;
			case "a":
				bot.setControlState("left", true);
				setTimeout(function () {
					bot.setControlState("left", false);
				}, 100);
				break;
			case "d":
				bot.setControlState("right", true);
				setTimeout(function () {
					bot.setControlState("right", false);
				}, 100);
				break;
			case "sprint":
				bot.setControlState("sprint", true);
				break;
			case "stop":
				bot.clearControlStates();
				break;
			case "jump":
				bot.setControlState("jump", true);
				bot.setControlState("jump", false);
				break;
			case "hold jump":
				bot.setControlState("jump", true);
				break;
			case "attack":
				entity = bot.nearestEntity();
				if (entity) {
					bot.attack(entity);
				} else {
					bot.chat("no nearby entities");
				}
				break;
			case "mount":
				entity = bot.nearestEntity((entity) => {
					return entity.name === "minecart" || entity.name === "boat";
				});
				if (entity) {
					bot.mount(entity);
				} else {
					bot.chat("No hay objetos cerca!");
				}
				break;
			case "dismount":
				bot.dismount();
				break;
			case "vehicle forward":
				bot.moveVehicle(0.0, 1.0);
				break;
			case "vehicle backward":
				bot.moveVehicle(0.0, -1.0);
				break;
			case "vehicle left":
				bot.moveVehicle(1.0, 0.0);
				break;
			case "vehicle right":
				bot.moveVehicle(-1.0, 0.0);
				break;
			case "pos":
				bot.chat(bot.entity.position.toString());
				break;
			case "items":
				bot.chat(`${items.join(", ")}`);
				break;
		}
	}

	if (
		message.content.includes("execute") &&
		message.author.id === "703974042700611634"
	) {
		const trimmed = message.content.replace("execute ", "")
		switch (trimmed) {
			case 'stop responses': {
				stopResponses = true
				message.reply('I\'ll stop responding to messages!')
			} break;
			case 'continue responding': {
				stopResponses = false
				message.reply('I\'ll continue responding...')
			} break;
			default: {
				bot.chat(trimmed);
				message.reply("ok");
			} break;
		}
	}
	console.log(
		`${colorette.bgYellow("MSG")} => message ${message.content} recieved`
	);
});
client.on("ready", () => {
	console.log(colorette.bgGreen("Logged onto Discord!"));
	client.user?.setActivity({name: 'tus mensajes', type: ActivityType.Watching})
});

bot.on("login", () => {
	console.log(colorette.bgGreen("Logged onto Minecraft!"));
	client.login(process.env.TOKEN);
});
bot.once("spawn", () => {
	mineflayerViewer(bot, { port: 3007, firstPerson: true });
	inventoryViewer(bot);
});
bot.on("kicked", console.log);
bot.on("error", console.log);
