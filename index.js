require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const http = require('http');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Simple Server for Render to keep it alive
http.createServer((req, res) => {
    res.write('Bot is running');
    res.end();
}).listen(process.env.PORT || 3000);

// Professional Main Menu
const mainMenu = Markup.keyboard([
    ['💰 Payment Issues', '💸 Withdraw Issues'],
    ['📺 Ad Problems', '🛠 Technical Support'],
    ['👤 My Account', '📢 Join Channel']
]).resize();

bot.start((ctx) => {
    ctx.reply(`Welcome ${ctx.from.first_name} to our Support Bot. How can we help you today?`, mainMenu);
});

// Handlers for Specific Issues
bot.hears('💰 Payment Issues', (ctx) => {
    ctx.reply('Please send your Transaction ID and the amount you deposited. Our finance team will check it within 24 hours.');
});

bot.hears('💸 Withdraw Issues', (ctx) => {
    ctx.reply('Withdrawals are processed every 12 hours. If you haven\'t received yours, please provide your User ID.');
});

bot.hears('📺 Ad Problems', (ctx) => {
    ctx.reply('If ads are not loading, try clearing your app cache or restart your internet connection.');
});

bot.hears('🛠 Technical Support', (ctx) => {
    ctx.reply('Please describe your technical problem in detail. You can also attach a screenshot if needed.');
});

bot.hears('👤 My Account', (ctx) => {
    ctx.reply(`User Info:\nName: ${ctx.from.first_name}\nID: ${ctx.from.id}`);
});

bot.hears('📢 Join Channel', (ctx) => {
    ctx.reply('Stay updated by joining our official channel: [Link Here]');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));