const https = require('https');
const { execSync } = require('child_process');

https.get('https://registry.npmjs.org/fluentui-emoji/latest', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const pkg = JSON.parse(data);
    const tarballUrl = pkg.dist.tarball;
    console.log('Tarball URL:', tarballUrl);
    
    execSync(`curl -sL ${tarballUrl} | tar -tz | grep -i folder`, { stdio: 'inherit' });
  });
});
