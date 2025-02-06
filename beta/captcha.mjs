import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

let images = {
  0: [],
};

process.argv.slice(process.argv.indexOf('-')+1).forEach(arg => {
  if (arg === "-") images[Number(Object.keys(images).at(-1)) + 1] = [];
  else if (Number(arg) != NaN) images[Object.keys(images).at(-1)].push(arg);
});

async function sendPhoto(photo) {
  if (process.argv[3] === '%NOVALUE%' || process.argv[4] === '%NOVALUE%') {
    console.log("{red}{bold}botToken{/bold} или {bold}chatID{/bold} не обозначены в конфиге\nКартинка капчи не будет отправлена через телеграм бота{/red}")
    return
  }
	const { default: Telebot } = await import('telebot');
	const bot = new Telebot(process.argv[3]);
  await bot.sendPhoto(process.argv[4], photo);
}

async function loadImages() {
  for (let row in images) {
    images[row] = await Promise.all(
      images[row].map(img => loadImage(`maps/map_${img.padStart(6, "0")}.png`))
    );
  }
  return images;
}

async function createCaptcha() {
  await loadImages();
  
  if (images[0].length === 0 || images[0][0].width === undefined) {
    console.error('Не удалось загрузить изображения');
    return;
  }
  const maxWidth = Math.max(...Object.keys(images).map(x => images[x].length)) * images[0][0].width;
  const canvas = createCanvas(maxWidth, images[0][0].width * Object.keys(images).length);
  const ctx = canvas.getContext('2d');

  Object.keys(images).forEach((row, i) => {
    images[row].forEach((img, j) => {
      ctx.drawImage(img, j * img.width, i * img.width);
    });
  });

  const buffer = canvas.toBuffer()
  if (process.argv[2] == "-s") {
    const { default: open } = await import('open');
    fs.writeFileSync('captcha.png', buffer)
    open('captcha.png');
  } else if (process.argv[2] == "--tg") sendPhoto(buffer)
}

createCaptcha();