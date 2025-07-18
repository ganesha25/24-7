import mineflayer from 'mineflayer';
import express from 'express';

// ✅ Web server to keep Render alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// 🤖 Create and manage bot
function createBot() {
  const bot = mineflayer.createBot({
    host: 'astramc.us.to',
    port: 11762,
    username: 'Bindass',
    version: '1.21.1' // 👈 Important: set correct version here
  });

  bot.on('spawn', () => {
    console.log('✅ Bot Spawned');

    // Step 1: Wait 5s → login
    setTimeout(() => {
      bot.chat('/login bindass00');
      console.log('🔐 Sent /login');

      // Step 2: Wait 20s after login → go to /server duels
      setTimeout(() => {
        bot.chat('/server duels');
        console.log('🎮 Sent /server duels');
      }, 20000);

    }, 5000); // delay after spawn

    // 🔁 Movement Logic
    let isForwardBackward = true;
    let directionToggle = true;

    const move = () => {
      bot.clearControlStates();

      if (isForwardBackward) {
        bot.setControlState(directionToggle ? 'forward' : 'back', true);
        console.log(directionToggle ? '➡️ Moving forward' : '⬅️ Moving back');
      } else {
        bot.setControlState(directionToggle ? 'right' : 'left', true);
        console.log(directionToggle ? '➡️ Moving right' : '⬅️ Moving left');
      }

      setTimeout(() => {
        bot.clearControlStates();
        directionToggle = !directionToggle;
      }, 3000);
    };

    setInterval(move, 3000);

    // 🔁 Switch movement direction every 60s
    setInterval(() => {
      isForwardBackward = !isForwardBackward;
      console.log(`🔁 Switching to ${isForwardBackward ? 'forward/backward' : 'right/left'} mode`);
    }, 60000);

    // 👊 Left Click every 1s
    setInterval(() => {
      bot.swingArm();
      console.log('👊 Left Clicked');
    }, 1000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected. Reconnecting in 5s...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('❌ Error:', err));
}

createBot();
