// 📌 Import libraries
import mineflayer from 'mineflayer';
import express from 'express';

// 📌 Express setup to keep Render app alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// 📌 Bot creation function
function createBot() {
  const bot = mineflayer.createBot({
    host: 'Bhaikaserver25.aternos.me',  // replace with your Aternos server IP
    port: 41582,
    username: 'AFK_Bot',
    version: false // auto-detect version
  });

  bot.on('spawn', () => {
    console.log('✅ Bot spawned and AFK now.');

    // AFK movement - jump every 10 seconds
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 10000);

    // Optional: slowly rotate to avoid AFK detection
    let yaw = 0;
    setInterval(() => {
      yaw += Math.PI / 8;
      bot.look(yaw, 0);
    }, 5000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('❌ Error:', err));
}

// 🔁 Start the bot
createBot();
