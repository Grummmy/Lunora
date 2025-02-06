/*
 * 				Terminal flags
 * all flags can be used in any order, except the username
 *
 * <username> - First argument, bot's username
 * --host <server> - Server address (default: 'localhost')
 * --port <port> - Server port (default: 25565)
 * --version <version> - Minecraft version (default: '1.16.5')
 * --brand <brand> - Minecraft client type, ex. Forge, Lunar (default: 'newUwU')
 * --cfg-file <cfg name> - name of config file to use, without .json (default: 'config')
 * --captcha <captcha cfg name> - name of captcha settings to use from cfg (default: 'auraland')
 * --trgr-img <img to trigger> - img number of a map to trigger captcha gathering
 * (default: highest number in captcha configuration)
 * -s - Enable chat logging to file (default: false)
 * -с - open aura captcha automaticlly (default: false)
 * -i - use interface(won't work proparly on Windows) (default: false)
 * -tgc - send captcha through telegram bot, configured in cfg file
 *
 *			 	Example usage:
 * node bot.js MyBot --host abc.example.com -s --version 1.16.5 -i
 *
 *        Bot commands:
 * . - messages '/server polit'
 * .tab - list sonline players 
 * .afk - enables simple antiAFK function
 * .inv - displayes your inventory in {slot} {item} {counf} form
 * .inv g - displays inventory grid
 * .w n - n stays for amount of seconds for bot to walk forward
 */

const mineflayer = require("mineflayer");
const { mapDownloader } = require("mineflayer-item-map-downloader");
const fs = require("fs");
const { spawn } = require("child_process");
const inventoryGrid = `+---+----------+
|  5|          |    +---+---+
+---+    S     |    |  1|  2|   +---+
|  6|    T     |    +---+---+   |  0|
+---+    E     |    |  3|  4|   +---+
|  7|    V     |    +---+---+
+---+    E     +---+
|  8|          | 45|
+---+----------+---+
+---+---+---+---+---+---+---+---+---+
|  9| 10| 11| 12| 13| 14| 15| 16| 17|
+---+---+---+---+---+---+---+---+---+
| 18| 19| 20| 21| 22| 23| 24| 25| 26|
+---+---+---+---+---+---+---+---+---+
| 27| 28| 29| 30| 31| 32| 33| 34| 35|
+---+---+---+---+---+---+---+---+---+
+---+---+---+---+---+---+---+---+---+
| 36| 37| 38| 39| 40| 41| 42| 43| 44|
+---+---+---+---+---+---+---+---+---+`;

const args = process.argv.slice(3);
let flags = {
  long: {
    "--host":  "localhost",
    "--version": "1.16.5",
    "--port":  25565,
    "--brand": "newUwU",
    "--cfg-file": "config",
    "--captcha": "auraland",
    "--trgr-img": "",
  },
  short: {
    "-s": false,
    "-c": false,
    "-n": false,
    "-i": false,
    "-tgc": false,
  }
};

args.forEach(arg => {
  if (flags.long[arg]) flags.long[arg] = args[args.indexOf(arg) + 1]
  else if (flags.short.hasOwnProperty(arg)) flags.short[arg] = !flags.short[arg]
});

let antiafk = false;
let cfg
try {
  cfg = require(`./${flags.long["--cfg-file"]}.json`)
} catch (error) {
  if (error.code === 'MODULE_NOT_FOUND') {
    console.error(`Ошибка: Файл конфигурации(${flags.long["--cfg-file"]}.json) не найден!\n`);
    console.log("\nДля корректной работы нужен файл конфигурации.")
    process.exit(1)
  } else if (error instanceof SyntaxError) {
    console.error(`Ошибка синтаксиса в файле конфигурации(${flags.long["--cfg-file"]}.json):\n`, error.message);
    console.log("\nДля корректной работы файл конфигурации должен быть корректно написан.")
    process.exit(1)
  } else if (error.code === 'EACCES') {
    console.error(`Ошибка доступа: Нет прав на чтение файла конфигурации(${flags.long["--cfg-file"]}.json).`);
    console.log("\nДля корректной работы нужен доступ к файлу конфигурации.")
    process.exit(1)
  } else {
    console.error(`Ошибка с файлом конфигурации(${flags.long["--cfg-file"]}.json):`, error.message);
    console.log("\nДля корректной работы нужен файл конфиуграции.")
    process.exit(1)
  }
}

if (!fs.existsSync('maps')) {
  fs.mkdirSync('maps');
}

globalThis.options = {
  host: flags.long["--host"],
  port: parseInt(flags.long["--port"], 10),
  username: process.argv[2],
  version: flags.long["--version"],
  viewDistance: "tiny",
  "mapDownloader-outputDir": "maps",
  brand: flags.long["--brand"],
};

// newLine(text, autoScroll) - shows new line on screen/console
// restore() - restores screen keybinds and events
if (flags.short["-i"] && fs.existsSync('interface.js')) {
  const { screen, chatBox, inputBox } = require('./interface.js');
  Object.defineProperty(globalThis, 'newLine', {
    value: function(text, autoScroll=true) {
      chatBox.pushLine(text);
      screen.render(); 
      
      if (autoScroll) {
        if (chatBox.getScroll() >= chatBox.getScrollHeight()-chatBox.height || chatBox.getScroll() === 0) {chatBox.setScrollPerc(100)}
      }
    },
    writable: false,
    configurable: false,
  });
} else {
  if (flags.short["-i"]) console.log("\x1b[31mФайл интерфейса не был найден, использование интерфейса не возможно\x1b[0m")

  Object.defineProperty(globalThis, 'newLine', {
    value: function(text, autoScroll=true) {console.log(text)},
    writable: false,
    configurable: false,
  });
}

if (flags.short["-s"]) {				// logThis(text) - logs text to chatLogFile variable
	Object.defineProperty(globalThis, 'chatLogFile', {
    value: `${options.host.split(".").length > 2 ? options.host.split(".")[1] : options.host}.txt`,
    writable: false,
    configurable: false,
  });
	if (!fs.existsSync(chatLogFile)) fs.writeFileSync(chatLogFile, "");

	Object.defineProperty(globalThis, 'logThis', {
	  value: function(text) {
	    fs.appendFile(chatLogFile, text, (err) => {if (err) throw err;});
	  },
	  writable: false,
	  configurable: false,
	});
} else {
	Object.defineProperty(globalThis, 'logThis', {
	  value: function(text) {},
	  writable: false,
	  configurable: false,
	});
}

globalThis.bot = mineflayer.createBot(options);

bot.loadPlugin(mapDownloader);

const originalWarn = console.warn;
console.warn = function (message) {
  if (message.includes('Ignoring block entities as chunk failed to load')) {return}
  originalWarn.apply(onsole, arguments);
};

bot.on("login", () => {
	const message = `\nBot has logged into the server as ${bot.username}.`;
  newLine(message);
  logThis(message);
});

bot.on("message", (message) => {
  // if (flags.short["-n"] && ["ʟ", "ɢ", "ᴛ", "ɴ"].includes(message.toString()[0])) {
  //   var mes = addNickname(message);
  // } else {var mes = message}

  newLine(message.toAnsi());
  logThis(`\n${message.toString()}`)
});

bot.on("error", (err) => {
  newLine("An error occurred:", err);
});

bot.on("kicked", (reason, loggedIn) => {
  let mes = loggedIn
    ? "\x1b[32mБыл залогинен, но кикнут: \x1b[0m"
    : "\x1b[31mНе был залогинен, но кикнут: \x1b[0m";
  let er = reason;
  newLine(`\n\n${mes}\n${er}\n\n`);
  logThis(`\n\n${mes}\n${er}\n\n`)
});

bot.on("end", () => {
  newLine("\nБот отключен от сервера");
  logThis("\nБот отключен от сервера");
});

if (flags.short["-c"] || flags.short["-tgc"]) {
  if (flags.long["--captcha"] in cfg.captcha) {
    const path = `maps/map_${String(flags.long["--trgr-img"] || Math.max(...Object.values(cfg.captcha[flags.long["--captcha"]]).flat())).padStart(6, "0")}.png`
    fs.watchFile(path, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        let args = ['captcha.mjs'];
        if (flags.short["-tgc"]) args.push('--tg', cfg.tg.botToken || '%NOVALUE%', cfg.tg.chatID || '%NOVALUE%')
        else args.push('-s');
        for (let row of cfg.captcha[flags.long["--captcha"]]) {
          args.push("-");
          row.map(img => args.push(img));
        }
        spawn("node", args, { stdio: ["ignore", "ignore", "ignore"] }).on("error", (error) => {newLine(error)});
      }
      fs.unwatchFile(path);
    });
  } else newLine(`\x1b[31mКонфигурация капчи ${flags.long["--captcha"]} не найдена в файле капчи\x1b[0m\nКонфигурации капчи: config.json/captcha/\n`)
}

if (!flags.short["-i"]) {
	process.stdin.on("data", (input) => {
  	messageEXE(bot, input);
	});
}

globalThis.messageEXE = function(bot, message) {
  message = message.toString().trim();

  if (message.startsWith(".")) {
    message = message.slice(1).split(" ");

    switch (message[0]) {
      case "":
        bot.chat("/server polit");
        break;
      case "h":
        const { screen, chatBox, inputBox } = require('./interface.js');
        newLine(`chatbox height: ${chatBox.height} and ${chatBox.getScroll()}`)
        break;
      case "tab":
        let players = Object.keys(bot.players);
        newLine(`Онлайн [\x1b[92m${players.length}\x1b[0m]: ${players.join("\x1b[36m,\x1b[39m ")}`);
        break;
      case "afk":
        antiafk = !antiafk;
        aAntiAFK(bot);
        newLine("Антиафк включен");
        break;
      case "inv":
        if (message.includes("g")) newLine(inventoryGrid);
        else newLine(`\nИнвентарь:\n${listInv(bot).join("; ")}`)
        break;
      case "w":
        if (message.length <= 1) {
          newLine('Требуется число секунд сколько должен пройти бот. Разрешены дробные числа(0.1, 0.05)')
        } else if (typeof Number(message[1]) === 'number') {
          bot.setControlState('forward', true);
          setTimeout(() => {bot.setControlState('forward', false);}, parseFloat(message[1]) * 1000)
          newLine('Бот идет вперед')
        } else {
          newLine('Аргумент должен быть числом.')
        }
        break;
    }
  } else bot.chat(message);
}

// in development, maybe
function reasonToText(reason) {
  reason = JSON.parse(reason);
  let text = [];
  for (let line of reason["extra"]) {
    text.push(hexToAnsi(line.color, line.text));
  }
  text.push(reason["text"]);
  return text;
}

// worked only for mc.politmilitary.fun; for other servers
// change the func yourself or wait for an update with cfg for this
function addNickname(message) {
  for (let i = message.extra[0].extra.length - 2; i >= 0; i--) {
    if (/^[^\{]{3,}[а-яА-Яa-zA-Z]+[^\}]*$/.test(message.extra[0].extra[i].text)) {
      message.extra[0].extra[i].text =
        message.extra[0].hoverEvent.contents.extra[1].text.trim() + " ";
      break;
    }
  }

  return message;
}

// in development, maybe
function hexToAnsi(hex, text) {
  let color = hex.slice(1).match(/.{1,2}/g);
  color.map((x) => parseInt(x, 10));
  const [r, g, b] = color;

  return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
}

function listInv(bot) {
  const inventory = bot.inventory;
  const items = inventory
    .items()
    .map((item) => `${item.slot} ${item.name} x${item.count}`);
  
  return items;
}

async function aAntiAFK(bot) {
  while (antiafk) {
    bot.chat("/damn, I don't want to be afk!");
    await new Promise((resolve) => setTimeout(resolve, 300000));
    if (!antiafk) {
      break;
    }
  }
  return;
}
