import * as colorette from "colorette";
import mineflayer from "mineflayer";
import { mineflayer as mineflayerViewer } from "prismarine-viewer";
import { Client } from "discord.js";

const bot = mineflayer.createBot({
	host: "testingsrizan.aternos.me", // minecraft server ip
	username: "YourMom", // minecraft username
	// password: '12345678' // minecraft password, comment out if you want to log into online-mode=false servers
	port: 24311, // only set if you need a port that isn't 25565
	version: "1.18.2", // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
	// auth: 'mojang'              // only set if you need microsoft auth, then set this to 'microsoft'
});

let target;

bot.on("chat", async (username, message) => {
	const items = await Promise.all(bot.inventory.items().map(item => {
		return item.displayName
	}))
	target = bot.players[username].entity;
	let entity;
	switch (message) {
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
		case "move vehicle forward":
			bot.moveVehicle(0.0, 1.0);
			break;
		case "move vehicle backward":
			bot.moveVehicle(0.0, -1.0);
			break;
		case "move vehicle left":
			bot.moveVehicle(1.0, 0.0);
			break;
		case "move vehicle right":
			bot.moveVehicle(-1.0, 0.0);
			break;
		case "pos":
			bot.chat(bot.entity.position.toString());
			break;
		case "yp":
			bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`);
			break;
		case "items":
			bot.chat(`${items.join(', ')}`)
			break;
	}
});

bot.on("login", () => {
	console.log(colorette.bgGreen("Logged on!"));
});
bot.once("spawn", () => {
	mineflayerViewer(bot, { port: 3007, firstPerson: true });
});

// Log errors and kick reasons:
bot.on("kicked", console.log);
bot.on("error", console.log);
