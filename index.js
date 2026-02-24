require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const http = require('http');

const bot = new Telegraf(process.env.BOT_TOKEN);

// --- CONFIGURATION ---
const ADMIN_ID = process.env.ADMIN_ID; // Your Telegram User ID

// Simple Server for Render
http.createServer((req, res) => {
    res.write('Professional Bot is Online');
    res.end();
}).listen(process.env.PORT || 3000);

// --- KEYBOARDS ---
const mainMenu = Markup.keyboard([
    ['💰 Payment Issues', '💸 Withdraw Issues'],
    ['📺 Ad Problems', '🛠 Technical Support'],
    ['👤 My Account', '📞 Contact Admin']
]).resize();

// --- BOT LOGIC ---

bot.start((ctx) => {
    ctx.reply(`Hello ${ctx.from.first_name}!\nWelcome to our Professional Support System. Please select an option below:`, mainMenu);
});

// Handling Support Buttons
const supportHandler = (ctx, topic) => {
    ctx.reply(`You selected: ${topic}\nPlease describe your issue in one message. Our admin will get back to you shortly.`);
    // Save state or context if needed, but for simple bots, we just inform the user.
};

bot.hears('💰 Payment Issues', (ctx) => supportHandler(ctx, 'Payment Issue'));
bot.hears('💸 Withdraw Issues', (ctx) => supportHandler(ctx, 'Withdraw Issue'));
bot.hears('📺 Ad Problems', (ctx) => supportHandler(ctx, 'Ad Problem'));
bot.hears('🛠 Technical Support', (ctx) => supportHandler(ctx, 'Technical Support'));
bot.hears('👤 My Account', (ctx) => {
    ctx.reply(`--- ACCOUNT INFO ---\nName: ${ctx.from.first_name}\nUser ID: ${ctx.from.id}\nUsername: @${ctx.from.username || 'N/A'}`);
});

bot.hears('📞 Contact Admin', (ctx) => {
    ctx.reply('Directly send your message now. Admin will see it.');
});

// --- ADMIN FORWARDING SYSTEM ---

bot.on('message', (ctx) => {
    const userId = ctx.from.id;
    const messageText = ctx.message.text;

    // If Admin replies to a forwarded message
    if (userId == ADMIN_ID && ctx.message.reply_to_message) {
        const replyInfo = ctx.message.reply_to_message.text;
        // Extracting User ID from the forwarded text (Simple logic)
        const targetUserId = replyInfo.split('ID: ')[1]?.split('\n')[0];
        
        if (targetUserId) {
            bot.telegram.sendMessage(targetUserId, `📩 **Admin Response:**\n\n${messageText}`, { parse_mode: 'Markdown' });
            ctx.reply('✅ Response sent to user.');
        } else {
            ctx.reply('❌ Could not find User ID to reply.');
        }
        return;
    }

    // Forward User messages to Admin (excluding buttons)
    const isButton = ['💰 Payment Issues', '💸 Withdraw Issues', '📺 Ad Problems', '🛠 Technical Support', '👤 My Account', '📞 Contact Admin'].includes(messageText);
    
    if (userId != ADMIN_ID && !isButton) {
        bot.telegram.sendMessage(ADMIN_ID, `📩 **New Support Message**\nFrom: ${ctx.from.first_name}\nID: ${userId}\n\nMessage: ${messageText}`);
        ctx.reply('Your message has been sent to the admin. Please wait for a response.');
    }
});

bot.launch();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
