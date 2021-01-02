require('dotenv').config();
const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const resemble = require('node-resemble-js');
const TelegramBot = require('node-telegram-bot-api');
const TelegramBotToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(TelegramBotToken, { polling: true });
const CHAT_ID = process.env.CHAT_ID;
const PORT = process.env.port;

const webSitesUrl = [
  {
    url: 'https://rozetka.com.ua/playstation_5_digital_edition_2/p223596301/',
    oldScreenshot: './oldScreenshots/rozetka.png',
    name: 'rozetka.png',
    acceptableMismatch: '0.3'
  },
  {
    url: 'https://allo.ua/ru/igrovye-pristavki/konsol-playstation-5-digital-edition.html',
    oldScreenshot: './oldScreenshots/allo.png',
    name: 'allo.png',
    acceptableMismatch: '2.5'
  },
  {
    url: 'https://www.moyo.ua/igrovaya_pristavka_playstation_5_digital_edition_pervaya_postavka_/475056.html',
    oldScreenshot: './oldScreenshots/moyo.png',
    name: 'moyo.png',
    acceptableMismatch: '0.4'
  }
]

async function makeScreenshot(url, name) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1366, height: 800 });

    await page.screenshot({ path: `newScreenshots/${name}` });
    return null
  } catch (e) {
    console.log(e)
  }
}

const sendUpdate = (name, url) => {
  bot.sendMessage(
    CHAT_ID,
    `<b>${name}</b> SCREENSHOT HAS BEEN CHANGED, CHECK THIS LINK \n<a href="${url}">${url}</a>`,
    { parse_mode: "HTML" }
  );
}

app.listen(PORT, () => {
  schedule.scheduleJob(`*/1 * * * *`, () => {
    webSitesUrl.forEach(async ({ url, name, oldScreenshot, acceptableMismatch }) => {
      sendUpdate('moyo.png', 'https://www.moyo.ua/igrovaya_pristavka_playstation_5_digital_edition_pervaya_postavka_/475056.html')
    //   await makeScreenshot(url, name)
  
    //   const newScreenshot = `./newScreenshots/${name}`
    //   resemble(newScreenshot)
    //     .compareTo(oldScreenshot)
    //     .ignoreColors()
    //     .onComplete(({ misMatchPercentage }) => {
    //       const mismatch = Number(misMatchPercentage)
    //       const acceptable_mismatch = Number(acceptableMismatch)
  
    //       console.log(name, mismatch)
    //       if (mismatch >= acceptable_mismatch) {
    //         sendUpdate(name, url)
    //       }
    //     });
    })
  });
})