import mineflayer from 'mineflayer';
import express from 'express';

// Express setup
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// Bot create
function createBot() {
  const bot = mineflayer.createBot({
    host: 'BindassSMP01.aternos.me',
    port: 50832,
    username: 'Bindass',
    version: false
  });

  const directions = ['forward', 'back', 'left', 'right'];
  let currentDirection = 'forward';

  const startMoving = () => {
    directions.forEach(dir => bot.setControlState(dir, false));
    bot.setControlState(currentDirection, true);
    console.log('➡️ Moving:', currentDirection);
  };

  const turnRandom = () => {
    directions.forEach(dir => bot.setControlState(dir, false));
    const others = directions.filter(d => d !== currentDirection);
    currentDirection = others[Math.floor(Math.random() * others.length)];
    startMoving();
  };

  const isBlockInFront = () => {
    const pos = bot.entity.position.offset(
      currentDirection === 'forward' ? 0 : currentDirection === 'back' ? 0 : currentDirection === 'left' ? -1 : 1,
      0,
      currentDirection === 'forward' ? 1 : currentDirection === 'back' ? -1 : currentDirection === 'left' ? 0 : 0
    );
    const block = bot.blockAt(pos);
    return block && block.boundingBox !== 'empty';
  };

  bot.on('spawn', () => {
    console.log('✅ Spawned and starting AFK box walk');

    startMoving();

    setInterval(() => {
      if (isBlockInFront()) {
        console.log('🧱 Wall detected, changing direction...');
        turnRandom();
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
