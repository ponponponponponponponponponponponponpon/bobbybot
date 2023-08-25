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
