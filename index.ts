import * as colorette from "colorette";
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { Client, GatewayIntentBits } from "discord.js";
import inventoryViewer from "mineflayer-web-inventory";
import "dotenv/config"

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
const bot = mineflayer.createBot({
	host: "testingsrizan.aternos.me",
	username: "YourMom",
	port: 24311,
	version: "1.18.2",
});

client.on("messageCreate", async (message) => {
	if (message.channel.id !== "1057648908630757426") return;
	const items = await Promise.all(
		bot.inventory.items().map((item) => {
			return item.displayName;
		})
	);
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
		case "press jump":
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
				bot.chat("no nearby objects");
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
	if (message.content.includes('execute') && message.author.id === '703974042700611634') {
		bot.chat(message.content.replace('execute ', ''))
		message.reply('ok')
	}
	console.log(`${colorette.bgYellow('MSG')} => message ${message.content} recieved`)
});
client.on("ready", () =>
	console.log(colorette.bgGreen("Logged onto Discord!"))
);

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
