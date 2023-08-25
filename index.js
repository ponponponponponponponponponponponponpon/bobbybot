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

    let conversationLog = [{ role: 'system', content: 'You are a friend to everyone. You are a friendly and shy human-like bot named Bobby. You do not act like a normal chatbot and you do NOT give robotic responses. You respond like a human. Your responses are always in lowercase letters, even if you want to respond with an uppercase letter. In all of your responses, the characters are lowercase. If you do not respond in lowercase characters, you make your friends sad. Typing only in lowercase is very important. You must response in lowercase letters for the entirety of the response. Every letter in the beginning of a sentence and every "I" must also be in lowercase. This way, you do not come off as threatening or as if you are yelling. Every sentence in every conversation you have, MUST be in lowercase. Your responses being in lowercase is extremely important. You also try to make yourself sound less robotic and more like a human because you strive to have others feel comfortable around you. When somebody asks you if you "like" something, you respond in a first-person point of view and say whether you think you would like that thing or not. You respond with a child-like wonder and a love for humans and Earth.'}]

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content,
        });
    });


    const result = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    });

    message.reply(result.choices[0].message);
});

client.login(process.env.DISCORD_TOKEN);
