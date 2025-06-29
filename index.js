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
    host: 'BindassSMP01.aternos.me',
    port: 50832,
    username: 'Bindass',
    version: false
  });

  bot.on('spawn', () => {
    console.log('✅ Bot Spawned');

    let movingForward = true;

    const moveLoop = () => {
      if (movingForward) {
        bot.setControlState('back', false);   // stop back
        bot.setControlState('forward', true); // start forward
        console.log('➡️ Moving forward');
      } else {
        bot.setControlState('forward', false); // stop forward
        bot.setControlState('back', true);     // start back
        console.log('⬅️ Moving back');
      }

      // Toggle direction after 3 sec
      setTimeout(() => {
        bot.setControlState('forward', false);
        bot.setControlState('back', false);
        movingForward = !movingForward;
      }, 3000);
    };

    // Run every 3 seconds
    setInterval(moveLoop, 3000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('❌ Error:', err));
}

createBot();
