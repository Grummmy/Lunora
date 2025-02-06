# **Lunora v1.2.0c**

| Language | Link                                                  |
| -------- | ----------------------------------------------------- |
| English  | [[#Lunora – Installation and Usage Guide]]            |
| Русский  | [[#Lunora – Инструкция по установке и использованию]] |

# Lunora – Installation and Usage Guide

This bot is designed for console interaction with a Minecraft server. It supports various features, including chat logging, captcha creation and display, anti-AFK, and more.

# 📜 **License**

You can view the license in `LICENSE.md` or [**here**](https://telegra.ph/Grumm-Shield-LicenseGSL-v10-02-06).

## 🔧 Dependencies Installation and Configuration Setup

Before starting, make sure you have **Node.js** installed (version 14 or above). Then, install the necessary dependencies by running the following command in your terminal:

```sh
npm install
```

Here is an example of the `config.json` configuration file to set up the captcha pattern and Telegram bot information:
```json
{
  "captcha": {
    "auraland": [
      [14, 13, 12, 11, 10],
      [9, 8, 7, 6, 5],
      [4, 3, 2, 1, 0]
    ]
  },
  "tg": {
    "botToken": "YOUR_BOT_TOKEN",
    "chatID": "YOUR_CHAT_ID"
  }
}
```
You don't have to specify all the fields, you can just specify the ones whose functions you plan to use.

## 🚀 Starting the Bot

To start the bot, use the following command:
```sh
node bot.js <username> [options]
```
**Example command:**
```sh
node bot.js MyBot --host example.com --version 1.16.5 -s -i
```

## ⚙️ Available Options

| Option             | Description                                          | Default Value           |
| ------------------ | ---------------------------------------------------- | ----------------------- |
| `<username>`       | Bot's username                                       | **Required**            |
| `--host <server>`  | Server address                                       | `localhost`             |
| `--port <port>`    | Server port                                          | `25565`                 |
| `--version <ver>`  | Minecraft version                                    | `1.16.5`                |
| `--brand <brand>`  | Minecraft client (e.g., Forge, Lunar)                | `newUwU`                |
| `--cfg-file <cfg>` | Configuration file (without `.json`)                 | `config`                |
| `--captcha <name>` | Captcha configuration name                           | `auraland`              |
| `--trgr-img <num>` | Map ID that triggers captcha gathering after upload  | **Highest map ID from cfg** |
| `-s`               | Enable chat logging to a file                        | `false`                 |
| `-c`               | Automatically open captcha                           | `false`                 |
| `-i`               | Enable interface (may not work correctly on Windows) | `false`                 |
| `-tgc`             | Send captcha to Telegram                             | `false`                 |

## 📜 Bot Commands

While the bot is running, you can send the following commands to the console:

| Command       | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `.tab`        | Display the list of online players                               |
| `.afk`        | Toggle anti-AFK on/off                                           |
| `.inv`        | Show inventory (`.inv g` to display as a grid)                   |
| `.w <sec>`    | Make the bot walk forward for a specified number of seconds      |
| `.`           | Send the command `/server polit` to the server                   |

## 🔍 Possible Errors and Solutions

1. **Error: `Configuration file not found`**  
   **Solution:** Check if the `config.json` file exists in the bot's folder.

   **Error: `Syntax error in configuration file`**  
   **Solution:** Check for errors in the content of `config.json`.

2. **Error: `No permission to read configuration file`**  
   **Solution:** Run the command `chmod +r config.json` or use `sudo`.

   **Error: `Captcha configuration not found in captcha file`**  
   **Solution:** Change the captcha configuration name `--captcha <captcha configuration>` or create a configuration with the selected name.

## 🛠 Additional Features

- If `-s` is enabled, the bot saves the chat log to a file `<server>.txt`.
- If `-c` or `-tgc` is enabled, the bot automatically solves captchas using images.
- Enabling `-tgc` sends the captcha to Telegram if `botToken` and `chatID` are set in `config.json`.

💡 **Note:** When using the Telegram bot, ensure that your main Telegram account is added to the chat with the bot.

---

## **Captcha**

### **Creating a Captcha Collection Pattern**

1. **Open the configuration file**  
   - Find and open the configuration file used by the bot. By default, this is `config.json`.

2. **Add a new pattern**  
   - Locate the `captcha` object in the config and add a new pattern.
   - The pattern structure is an array of arrays, where each inner array contains captcha image numbers and represents one row of the captcha.

   **Example structure:**  
	```json
	"captcha": {  
     "auraland": [  
       ["1", "2", "3"],  
       ["4", "5", "6"],  
       ["7", "8", "9"]  
     ]
    }
	```
   - In this example, the captcha consists of 3 rows, each containing 3 images.  
   - The image numbers must correspond to the files in the `maps/` folder, for example:  
     - `maps/map_000001.png`  
     - `maps/map_000002.png`  
     - and so on...  

3. **Save the file and you can continue working with the bot**

---
### **Running the Captcha File Manually**

The `captcha.mjs` file allows you to manually (directly through the terminal, without using the bot and configuration file) collect a captcha from fragments and either open it or send it to Telegram.

#### **1. Running the captcha in display mode (`-s`)**  
If you just want to open the captcha:  
```sh
node captcha.mjs -s - 1 2 3 - 4 5 6 - 7 8 9
```
📌 **Argument Breakdown:**  
- `-s` — Open the image after generation.  
- `-` — Separates the rows of the captcha.  
- `1 2 3` — Image numbers for the first row.  
- `4 5 6` — Image numbers for the second row.  
- `7 8 9` — Image numbers for the third row.  

After running the command, a file `captcha.png` will be created and automatically opened.

#### **2. Sending Captcha to Telegram (`--tg`)**  
If you want to send the captcha to Telegram, pass `botToken` and `chatID` as arguments:  
```sh
node captcha.mjs --tg YOUR_BOT_TOKEN YOUR_CHAT_ID - 1 2 3 - 4 5 6 - 7 8 9
```
📌 **Argument Breakdown:**  
- `--tg` — Sends the captcha image through the Telegram bot.  
- `YOUR_BOT_TOKEN` — Your Telegram bot token.
- `YOUR_CHAT_ID` — Your chat ID with the bot, indicating which chat the bot will send the captcha to.
- `-` and image numbers work the same as in the previous example.

After running the command, the captcha will be sent to the specified chat.

---

# Lunora – Инструкция по установке и использованию

Данный бот предназначен для консольного взаимодействия с Minecraft-сервером. Он поддерживает различные функции, включая логирование чата, сборку капч и их отображение, анти-АФК и прочие.  

# 📜 **Лицензия**

Вы можете посмотреть лицензию в `LICENSE.md` или [**здесь**](https://telegra.ph/Grumm-Shield-LicenseGSL-v10-02-06).

## 🔧 Установка зависимостей и настройка конфигурации

Перед запуском убедитесь, что у вас установлен **Node.js** (версии 14 или выше). Затем установите нужные зависимости, выполнив в терминале команду:

```sh
npm install
```

Вот пример конфигурационного файла `config.json` для настройки паттерна капчи и информации Telegram-бота:
```json
{
  "captcha": {
    "auraland": [
      [14, 13, 12, 11, 10],
      [9, 8, 7, 6, 5],
      [4, 3, 2, 1, 0]
    ]
  },
  "tg": {
    "botToken": "YOUR_BOT_TOKEN",
    "chatID": "YOUR_CHAT_ID"
  }
}
```
Не обязательно указывать все поля, вы можете указать только те поля, функции которых планируете использовать.
## 🚀 Запуск бота

Для запуска бота используйте команду:
```sh
node bot.js <username> [опции]
```
**Пример запуска:**  
```sh
node bot.js MyBot --host example.com --version 1.16.5 -s -i
```

## ⚙️ Доступные опции

| Опция              | Описание                                                   | Значение по умолчанию |
| ------------------ | ---------------------------------------------------------- | --------------------- |
| `<username>`       | Никнейм бота                                               | **Обязательный**      |
| `--host <server>`  | Адрес сервера                                              | `localhost`           |
| `--port <port>`    | Порт сервера                                               | `25565`               |
| `--version <ver>`  | Версия Minecraft                                           | `1.16.5`              |
| `--brand <brand>`  | Клиент Minecraft (например, Forge, Lunar)                  | `newUwU`              |
| `--cfg-file <cfg>` | Файл конфигурации (без `.json`)                            | `config`              |
| `--captcha <name>` | Название конфигурации капчи                                | `auraland`            |
| `--trgr-img <num>` | ID карты, после загрузки которой запускается сбор капчи    | **Карта с высшим ID из конфига** |
| `-s`               | Включить логирование чата в файл                           | `false`               |
| `-c`               | Автоматически открывать капчу                              | `false`               |
| `-i`               | Включить интерфейс (может работать некорректно на Windows) | `false`               |
| `-tgc`             | Отправлять капчу в Telegram                                | `false`               |

## 📜 Команды бота

Во время работы бота можно отправлять команды в консоль:

| Команда       | Описание                                                       |
|--------------|-----------------------------------------------------------------|
| `.tab`      | Вывести список онлайн-игроков                                  |
| `.afk`      | Включить/выключить анти-АФК                                     |
| `.inv`      | Показать инвентарь (`.inv g` для отображения в виде сетки)      |
| `.w <sec>`  | Заставить бота идти вперед указанное количество секунд         |
| `.`         | Отправить команду `/server polit`                              |

## 🔍 Возможные ошибки и решения

1. **Ошибка: `Файл конфигурации не найден`**  
   **Решение:** Проверьте, существует ли `config.json` в папке с ботом.

   **Ошибка: `Ошибка синтаксиса в файле конфигурации`**  
   **Решение:** Проверьте, нет ли ошибок в содержании `config.json`.

2. **Ошибка: `Нет прав на чтение файла конфигурации`**  
   **Решение:** Запустите команду `chmod +r config.json` или используйте `sudo`.

   **Ошибка: `Конфигурация капчи не найдена в файле капчи`**  
   **Решение:** Измените имя конфигурации капчи `--captcha <конфигурация капчи>` или создайте конфигурацию с уже выбранным именем.
## 🛠 Дополнительные функции

- Если включен `-s`, бот сохраняет лог чата в файл `<server>.txt`.
- Если включен `-c` или `-tgc`, бот автоматически решает капчи, используя изображения.
- Включение `-tgc` отправляет капчу в Telegram, если настроены `botToken` и `chatID` в `config.json`.

💡 **Примечание:** При использовании Telegram-бота убедитесь, что ваш основной аккаунт в Telegram добавлен в чат с ботом.

---

## **Капча**  

### **Создание патерна сбора капчи**

1. **Открываем файл конфигурации**  
   - Найдите и откройте конфигурационный файл, который используется ботом. По умолчанию это `config.json`.  

2. **Добавляем новый паттерн**  
   - Найдите в конфиге объект `captcha` и добавьте туда новый паттерн.  
   - Структура паттерна представляет собой массив из массивов, где каждая строка содержит номера изображений капчи и обозначает 1 строку капчи.

   **Пример структуры:**  
	```json
	"captcha": {  
     "auraland": [  
       ["1", "2", "3"],  
       ["4", "5", "6"],  
       ["7", "8", "9"]  
     ]
    }  
	```
   - В этом примере капча состоит из 3 строк, каждая из которых содержит 3 изображения.  
   - Номера изображений должны соответствовать файлам в папке `maps/`, например:  
     - `maps/map_000001.png`  
     - `maps/map_000002.png`  
     - и так далее...  

3. **Сохраняем файл и можем продолжать работать с ботом**

---
### **Самостоятельный запуск файла капчи**  

Файл `captcha.mjs` позволяет вручную(на прямую через терминал, без использования бота и файла конфигурации) собрать капчу из фрагментов и открыть её или отправить в Telegram. 

#### **1. Запуск капчи в режиме отображения (`-s`)**  
Если нужно просто открыть капчу:  
```sh  
node captcha.mjs -s - 1 2 3 - 4 5 6 - 7 8 9  
```
📌 **Разбор аргументов:**  
- `-s` — Открыть изображение после генерации.  
- `-` — Разделяет строки капчи.  
- `1 2 3` — Номера изображений первой строки.  
- `4 5 6` — Номера изображений второй строки.  
- `7 8 9` — Номера изображений третьей строки.  

После выполнения команды будет создан файл `captcha.png`, который автоматически откроется.  

#### **2. Отправка капчи в Telegram (`--tg`)**  
Если нужно отправить капчу в Telegram, передайте `botToken` и `chatID` как аргументы:  
```sh
node captcha.mjs --tg YOUR_BOT_TOKEN YOUR_CHAT_ID - 1 2 3 - 4 5 6 - 7 8 9  
```
📌 **Разбор аргументов:**  
- `--tg` — Отправляет изображение капчи через Telegram-бота.  
- `YOUR_BOT_TOKEN` — Токен вашего Telegram-бота.
- `YOUR_CHAT_ID` — ID вашего с ботом чата, обозначает в какой чат бот попробует отправить капчу
- `-` и номера изображений работают так же, как в предыдущем примере.  

После выполнения команды капча будет отправлена в указанный чат.  
