import mineflayer from 'mineflayer';

function createBot() {
  const bot = mineflayer.createBot({
    host: 'your-server.aternos.me', // your Aternos server IP (without port)
    port: 25565, // default port
    username: 'AFK_Bot', // any name
    version: false // auto-detect version
  });

  bot.on('spawn', () => {
    console.log('Bot spawned! Staying AFK...');

    // Simple jump loop to avoid kick
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 10000); // every 10 sec

    // Optional: rotate head slowly
    let yaw = 0;
    setInterval(() => {
      yaw += Math.PI / 8;
      bot.look(yaw, 0);
    }, 5000);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('error', err => console.log('Error:', err));
}

createBot();
