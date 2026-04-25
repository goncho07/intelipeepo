const https = require('https');

https.get('https://app.unpkg.com/fluentui-emoji@1.3.0/files/icons/modern/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/href="([^"]*folder[^"]*)"/gi);
    console.log(matches);
  });
});
