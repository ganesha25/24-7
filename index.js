import mineflayer from 'mineflayer';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (_, res) => res.send('✅ Garuda AFK Bot is alive!'));
app.listen(PORT, () => console.log(`🌐 Web server running on port ${PORT}`));

function createBot() {
  const bot = mineflayer.createBot({
    host: 'astramc.us.to',
    port: 11762,
    username: 'Bindass',
    version: '1.21.1'
  });

  bot.on('spawn', () => {
    console.log('✅ Bot Spawned');

    // 🧠 Auto Close GUI if any
    bot.on('windowOpen', (window) => {
      console.log('📕 GUI Opened:', window.title);
      bot.closeWindow();
    });

    // Extra safety GUI close
    setTimeout(() => {
      if (bot.currentWindow) {
        console.log('📕 Fallback GUI Close');
        bot.closeWindow();
      }
    }, 3000);

    // 📝 Step 1: Register after 6s
    setTimeout(() => {
      bot.chat('/register bindass00 bindass00');
      console.log('📝 Sent /register');

      // 🔐 Step 2: Login after 3s
      setTimeout(() => {
        bot.chat('/login bindass00');
        console.log('🔐 Sent /login');

        // 🎮 Step 3: Switch server after 20s
        setTimeout(() => {
          bot.chat('/server duels');
          console.log('🎮 Sent /server duels');
        }, 20000);

      }, 3000);

    }, 6000);

    // Movement Logic
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

    setInterval(move, 3000);
    setInterval(() => {
      isForwardBackward = !isForwardBackward;
    }, 60000);
    setInterval(() => {
      bot.swingArm();
    }, 1000);
  });

  bot.on('message', (msg) => {
    console.log('💬 Server:', msg.toString());
  });

  bot.on('end', (reason) => {
    console.log('⚠️ Bot disconnected. Reason:', reason);
    setTimeout(createBot, 5000);
  });

  bot.on('kicked', (reason) => {
    console.log('🚫 Kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('❗ Error:', err);
  });
}

createBot();
