let dotenv = require("dotenv");
dotenv.config(); //loads up all the env variables in the .env file

//Referencing the environment variable
//global process object has a property called env which is an object itself
// console.log(process.env.DISCORDJS_BOT_TOKEN);
const { Client, WebhookClient } = require("discord.js"); //OBJECT DESTRUCTURING - Importing a particular class from the module
const client = new Client({
  partials: ["MESSAGE", "REACTION"], //Partials is a DiscordJS concept which allows us to handle uncached data
}); //creating an instance of class Client

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} has logged in!`);
});
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    //MEANS THEY'RE TRYNA ISSUE A COMMAND
    const [CMD_NAME, ...args] = message.content
      .trim()
      .split("$")[1]
      .split(/\s+/);
    console.log(CMD_NAME);
    console.log(args);
    if (CMD_NAME.toLocaleLowerCase() === "kick") {
      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("You not have permission :((");
      if (args.length === 0) return message.reply("Please provide an ID");
      const member = message.guild.members.cache.get(args[0]); //.get() cuz cache is actually a collection - basically a MAP
      if (member) {
        member
          .kick()
          .then((member) => {
            message.channel.send(`${member} was kicked!`);
          })
          .catch((err) => {
            message.channel.send("I can not kick that user ://");
          });
      } else {
        message.channel.send("User not found!");
      }
    } else if (CMD_NAME.toLowerCase() === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("You not have permission :((");
      if (args.length === 0) return message.reply("Please provide an ID");
      try {
        const bannedUser = await message.guild.members.ban(args[0]);
        message.channel.send("User was banned successfully!");
      } catch (err) {
        console.log(err);
        message.channel.send(
          "An error occured. Either I do not have permissions or the user was not found!"
        );
      }
    } else if (CMD_NAME.toLowerCase() === "announce") {
      // console.log(args);
      const msg = args.join(" ");
      webhookClient.send(msg);
    }
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id); //since cache is an object
  if (reaction.message.id === "750055414091219076") {
    switch (name) {
      case "🍎": // "\:apple:"
        member.roles.add("750057336101404712");
        break;
      case "🍌": // \:banana:
        member.roles.add("750057382427492543");
        break;
      case "🍇": // \:grapes:
        member.roles.add("750057408327450755");
        break;
      case "🍑": // \:peach:
        member.roles.add("750057439872942271");
        break;
    }
  }
});

client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "750055414091219076") {
    switch (name) {
      case "🍎": // "\:apple:"
        member.roles.remove("750057336101404712");
        break;
      case "🍌": // \:banana:
        member.roles.remove("750057382427492543");
        break;
      case "🍇": // \:grapes:
        member.roles.remove("750057408327450755");
        break;
      case "🍑": // \:peach:
        member.roles.remove("750057439872942271");
        break;
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
//This line logs in our bot and makes it ONLINE
