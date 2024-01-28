const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const Config = {
  followNewTab: true,
  fps: 25,
  ffmpeg_Path: '/usr/bin/ffmpeg',
  videoFrame: {
    width: 1024,
    height: 768,
  },
  videoCrf: 18,
  videoCodec: 'libx264',
  videoPreset: 'ultrafast',
  videoBitrate: 1000,
  autopad: {
    color: 'black' | '#35A5FF',
  },
  aspectRatio: '4:3',
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const recorder = new PuppeteerScreenRecorder(page, Config);
  const pipeStream = new PassThrough();
  await recorder.startStream(pipeStream);
  await page.goto('https://google.com');
  await recorder.stop();
  await browser.close();
})();