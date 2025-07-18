// 📦 Dependencies
import mineflayer from 'mineflayer';
import express from 'express';

// 🌐 Keep bot alive on Render.com
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('✅ Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

// 🔁 Bot Creation Function
function createBot() {
  const bot = mineflayer.createBot({
    host: 'astramc.us.to',     // 🔁 Your Bungee server IP
    port: 11762,               // 🎯 Your Bungee server Port
    username: 'laluprashadji',       // 🧍 Bot username
    version: '1.21.1'          // ✅ Minecraft version
  });

  // ✅ On Bot Spawn
  bot.on('spawn', () => {
    console.log('✅ Bot Spawned');

    // 📕 Auto-close GUI windows (like book/menu)
    bot.on('windowOpen', (window) => {
      console.log('📕 GUI opened:', window.title);
      bot.closeWindow();
    });

    // 💬 Server chat message logs
    bot.on('message', (msg) => {
      console.log('💬 Server:', msg.toString());
    });

    // 📝 Step 1: Register after 5s
    setTimeout(() => {
      bot.chat('/register bindass00 bindass00');
      console.log('📝 Sent /register');

      // 🔐 Step 2: Login after 3s
      setTimeout(() => {
        bot.chat('/login bindass00');
        console.log('🔐 Sent /login');

        // 🎮 Step 3: Switch to duels server after 20s
        setTimeout(() => {
          bot.chat('/server duels');
          console.log('🎮 Sent /server duels');
        }, 20000);

      }, 3000);

    }, 5000);

    // 🕹️ Anti-AFK Movement
    let isForwardBackward = true;
    let directionToggle = true;

    const move = () => {
      bot.clearControlStates();
      const dir = isForwardBackward
        ? (directionToggle ? 'forward' : 'back')
        : (directionToggle ? 'right' : 'left');
      bot.setControlState(dir, true);
      console.log(`↔️ Moving: ${dir}`);

      setTimeout(() => {
        bot.clearControlStates();
        directionToggle = !directionToggle;
      }, 3000);
    };

    setInterval(move, 3000); // movement every 3s
    setInterval(() => {
      isForwardBackward = !isForwardBackward;
      console.log(`🔁 Switching direction mode: ${isForwardBackward ? 'forward/backward' : 'left/right'}`);
    }, 60000); // switch direction every 60s

    // 👊 Left-click every second
    setInterval(() => {
      bot.swingArm();
      console.log('👊 Left Clicked');
    }, 1000);
  });

  // ❌ On Disconnect
  bot.on('end', (reason) => {
    console.log('⚠️ Bot disconnected. Reason:', reason);
    setTimeout(createBot, 5000);
  });

  // 🚫 On Kick
  bot.on('kicked', (reason) => {
    console.log('🚫 Bot kicked. Reason:', reason);
  });

  // ❗ On Error
  bot.on('error', (err) => {
    console.log('❗ Bot error:', err);
  });
}

// 🚀 Start bot
createBot();
