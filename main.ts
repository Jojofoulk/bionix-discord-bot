// Get the utils functions
import DiscordUtils from "./src/utils/DiscordUtils";

// Get the packages
import * as Discord from "discord.js";
//import * as fs from "fs";
import * as util from "util";

// Get the command's functions
import { ChannelController } from "./src/controllers/ChannelController";
import { YoutubeController } from "./src/controllers/YoutubeController";
import { BattleshipController } from "./src/controllers/BattleshipController";

// Get the configuration
require("dotenv").config();
const config = process.env;

process.on("unhandledRejection", error =>
    console.error("Uncaught Promise Rejection", error)
);

// Prepare the log file
// const log_file: fs.WriteStream = fs.createWriteStream(
//   __dirname + "/logs/debug-" + Date.now() + ".log",
//   { flags: "w" }
// );
const log_stdout = process.stdout;
const client: Discord.Client = new Discord.Client();

let channelController: ChannelController = new ChannelController();
let youtubeController: YoutubeController = new YoutubeController(
    channelController
);
let battleshipController: BattleshipController = new BattleshipController();

// Override of the lof function to put the logs into a file
console.log = function(d) {
    let text = "[*] " + util.format(d) + "\n";

    //log_file.write(text);
    log_stdout.write(text);
};

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
    // If it calls the bot
    if (message.content.startsWith("/")) {
        console.log("Command | " + message.content);

        const command: string = message.content
            .split(" ")
            .shift()
            .substring(1);
        const args: string[] = DiscordUtils.getArgs(message);

        if (command === "ping") {
            DiscordUtils.reply(message, "Pong!");
        } else if (command === "channel") {
            channelController.runCommand(message, args);
        } else if (command === "boat") {
            battleshipController.runCommand(message, args);
        } else if (command === "ytb") {
            youtubeController.runCommand(message, args);
        }
    }
});

client.login(config.BOT_TOKEN);
