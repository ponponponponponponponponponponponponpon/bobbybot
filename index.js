// create a discord bot using openai api that interacts on the discord server
require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');
const { OpenAI } = require('openai');

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
]});

client.on('ready', () => {
    console.log("bobby is online!");
})

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(':3')) return;

    let conversationLog = [{ role: 'system', content: 'You are a friendly and shy chatbot. Your name is Bobby. Your responses are always in lowercase letters. You also try to make yourself sound less robotic and more like a human.'}]

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (message.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content,
        })
    })


    const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    })

    message.reply(result.choices[0].message);
})

client.login(process.env.DISCORD_TOKEN);


















// // prepare connection to openai api
// const { OpenAI } = require('openai');
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_KEY // This is also the default, can be omitted
// });

// // check for when a message on discord is sent
// client.on('messageCreate', async function(message){
//     try {
//         // don't respond to yourself bobby!
//         if(message.author.bot) return;

//         const gptResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             temperature: 0.9, // temp determines ai randomness - 1 being very random
//             max_tokens: 100,
//             stop: ["ChatGPT:"],
//             messages: [{"role": "user", "content": "hello!"}],
//             // prompt: `ChatGPT is a friendly, shy, and human-like response chatbot. ChatGPT only types in lowercase letters.\n\
//             // ChatGPT: Hello, how are you?\n\
//             // ${message.author.username}: ${message.content}\n\
//             // ChatGPT:`
//         });

//         message.reply(`${gptResponse.choices[0].message}`);
//         return;
//     } catch(err) {
//         console.log(err);
//     }
// });

// // log the bot
// client.login(process.env.DISCORD_TOKEN);
// console.log("Pon Bot is Online!");
