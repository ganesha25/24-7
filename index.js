import mineflayer from 'mineflayer';
import express from 'express';

// Web server to keep Render alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// Start the bot
function createBot() {
  const bot = mineflayer.createBot({
    host: 'BindassSMP01.aternos.me',
    port: 50832,
    username: 'Bindass',
    version: false,
  });

  const directions = ['forward', 'back', 'left', 'right'];
  let currentDirection = 'forward';

  // Start moving in current direction
  const move = () => {
    directions.forEach(dir => bot.setControlState(dir, false)); // stop all first
    bot.setControlState(currentDirection, true); // start current
    console.log(`➡️ Moving ${currentDirection}`);
  };

  // Pick new random direction
  const switchDirection = () => {
    const others = directions.filter(d => d !== currentDirection);
    currentDirection = others[Math.floor(Math.random() * others.length)];
    move();
  };

  // Get block in front of current direction
  const getFrontBlock = () => {
    const pos = bot.entity.position.clone();

    if (currentDirection === 'forward') pos.z += 1;
    if (currentDirection === 'back') pos.z -= 1;
    if (currentDirection === 'left') pos.x -= 1;
    if (currentDirection === 'right') pos.x += 1;

    return bot.blockAt(pos);
  };

  bot.on('spawn', () => {
    console.log('✅ Bot Spawned');

    move(); // Start movement

    setInterval(() => {
      const block = getFrontBlock();
      if (block && block.boundingBox !== 'empty') {
        console.log('🧱 Wall ahead! Switching direction...');
        switchDirection();
      }
    }, 1000);
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('❌ Error:', err));
}

createBot();
