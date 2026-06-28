const { app, nativeImage } = require('electron');

app.whenReady().then(() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#e87982" /></svg>`;
  const dataURL = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  const image = nativeImage.createFromDataURL(dataURL);
  console.log(image.toPNG().length);
  app.quit();
});
