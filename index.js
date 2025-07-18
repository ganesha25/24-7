import mineflayer from 'mineflayer';
import express from 'express';

// Web server to keep Render alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// Create Bot
function createBot() {
  const bot = mineflayer.createBot({
    host: 'astramc.us.to',
    port: 11762,
    username: 'Bindass',
    version: false
  });

  bot.on('spawn', () => {
    console.log('✅ Bot Spawned');

      // First, login
  bot.chat('/login bindass00');

  // Then, wait a few seconds and send /duels
  setTimeout(() => {
    bot.chat('/server duels'');
    console.log('🎮 Sent /server duels');
  }, 9000); // 3 seconds delay

    let isForwardBackward = true;
    let directionToggle = true;

    // 🔁 Movement Logic
    const move = () => {
      bot.clearControlStates();

      if (isForwardBackward) {
        if (directionToggle) {
          bot.setControlState('forward', true);
          console.log('➡️ Moving forward');
        } else {
          bot.setControlState('back', true);
          console.log('⬅️ Moving back');
        }
      } else {
        if (directionToggle) {
          bot.setControlState('right', true);
          console.log('➡️ Moving right');
        } else {
          bot.setControlState('left', true);
          console.log('⬅️ Moving left');
        }
      }

      setTimeout(() => {
        bot.clearControlStates();
        directionToggle = !directionToggle;
      }, 3000);
    };

    setInterval(move, 3000);

    // 🔁 Switch movement mode every 1 minute
    setInterval(() => {
      isForwardBackward = !isForwardBackward;
      console.log(`🔁 Switching to ${isForwardBackward ? 'forward/backward' : 'right/left'} mode`);
    }, 60000);

    // 🥊 Left click (swing arm) every second
    setInterval(() => {
      bot.swingArm(); // left click animation
      console.log('👊 Left Clicked');
    }, 1000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('❌ Error:', err));
}

createBot();
