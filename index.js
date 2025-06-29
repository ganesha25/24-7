import mineflayer from 'mineflayer';
import express from 'express';

// Express setup to keep Render app alive
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

// Bot creation function
function createBot() {
  const bot = mineflayer.createBot({
    host: 'BindassSMP01.aternos.me',
    port: 50832,
    username: 'Bindass',
    version: false
  });

  bot.on('spawn', () => {
    console.log('✅ Bot spawned and walking inside box.');

    let directions = ['forward', 'back', 'left', 'right'];
    let currentDirection = 'forward';

    const move = () => {
      // Stop all movement
      directions.forEach(dir => bot.setControlState(dir, false));
      // Start moving in currentDirection
      bot.setControlState(currentDirection, true);
    };

    const switchDirection = () => {
      // Random new direction
      const otherDirections = directions.filter(d => d !== currentDirection);
      currentDirection = otherDirections[Math.floor(Math.random() * otherDirections.length)];
      console.log('🔄 Wall hit! Changing direction to:', currentDirection);
      move();
    };

    move(); // Start moving initially

    setInterval(() => {
      const blockInFront = bot.blockAt(bot.entity.position.offset(
        Math.round(bot.entity.yaw / Math.PI * 2) % 4 === 0 ? (currentDirection === 'forward' ? 0 : 0) : 
        currentDirection === 'forward' ? Math.cos(bot.entity.yaw) : 
        currentDirection === 'back' ? -Math.cos(bot.entity.yaw) :
        currentDirection === 'left' ? -Math.sin(bot.entity.yaw) :
        currentDirection === 'right' ? Math.sin(bot.entity.yaw) : 0,
        0,
        Math.round(bot.entity.yaw / Math.PI * 2) % 4 === 0 ? (currentDirection === 'forward' ? 1 : -1) : 
        currentDirection === 'forward' ? Math.sin(bot.entity.yaw) : 
        currentDirection === 'back' ? -Math.sin(bot.entity.yaw) :
        currentDirection === 'left' ? Math.cos(bot.entity.yaw) :
        currentDirection === 'right' ? -Math.cos(bot.entity.yaw) : 0
      ));

      if (blockInFront && blockInFront.boundingBox !== 'empty') {
        switchDirection();
      }
    }, 1000); // Check for wall every second
  });

  bot.on('end', () => {
    console.log('⚠️ Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('❌ Error:', err));
}

createBot();
