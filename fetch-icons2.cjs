const https = require('https');

https.get('https://app.unpkg.com/fluentui-emoji@1.3.0/files/icons/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(data.substring(0, 1000));
  });
});
