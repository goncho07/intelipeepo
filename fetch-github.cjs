const https = require('https');

https.get('https://app.unpkg.com/fluentui-emoji@1.3.0/files/icons/modern/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/href="([^"]*)"/gi);
    if (matches) {
        const names = matches.map(m => m.replace('href="', '').replace('"', ''));
        console.log(names.slice(0, 20));
    }
  });
});
