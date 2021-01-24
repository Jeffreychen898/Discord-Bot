/*
TO-DO List:
--------------
Evaluate expressions
resource storage
personal lists
create channel
delete channel
translate
*/

/* import external libraries */
require("dotenv").config();
const { Client } = require("discord.js");
const client = new Client();

/* import modules from modules folder */
let module_math = require("./modules/math.js");

/* command list */
let command_list = new Map([
  ["$e", module_math.evaluate]
]);

/* login */
client.login(process.env.DISCORDJS_BOT_TOKEN);
client.on("ready", () => {
  console.log(client.user.username);
})

/* on message */
client.on("message", (message) => {
  parseCommands(message);
})

function parseCommands(message) {
  /* command start with a $ */
  if(message.content[0] == '$') {
    /* split the string */
    let split_message = message.content.split(" ");
    let parameters = [...split_message];
    /* remove the first index <= first index is the command */
    parameters.splice(0, 1);
    /* find and call the function */
    if(command_list.has(split_message[0])) {
      command_list.get(split_message[0])(parameters, message);
    }
  }
}

// client.on("message", (message) => {
//   let array = message.content.split(" ");
//   if(array[0] == "-channel") {
//     makeChannel(message, array[1]);
//     console.log("asdf");
//   }
// })
// function makeChannel(message, channelname){
//     var server = message.guild;
//
//     server.channels.create(channelname);
// }
