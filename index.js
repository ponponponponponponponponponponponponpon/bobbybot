// create a discord bot using openai api that interacts on the discord server
require('dotenv').config();

// prepare to connect to the discord api
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]});

// prepare connection to openai api
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY // This is also the default, can be omitted
});

// check for when a message on discord is sent
client.on('messageCreate', async function(message){
    try {
        // don't respond to yourself bobby!
        if(message.author.bot) return;

        const gptResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            temperature: 0.9, // temp determines ai randomness - 1 being very random
            max_tokens: 100,
            stop: ["ChatGPT:"],
            messages: [{"role": "user", "content": "hello!"}],
            // prompt: `ChatGPT is a friendly, shy, and human-like response chatbot. ChatGPT only types in lowercase letters.\n\
            // ChatGPT: Hello, how are you?\n\
            // ${message.author.username}: ${message.content}\n\
            // ChatGPT:`
        });

        message.reply(`${gptResponse.choices[0].message}`);
        return;
    } catch(err) {
        console.log(err);
    }
});

// log the bot
client.login(process.env.DISCORD_TOKEN);
console.log("Pon Bot is Online!");
