const fs = require('fs');

const files = [
  'modules/UsersModule.tsx',
  'components/UI.tsx',
  'App.tsx',
  'components/Modals.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace all rounded-md with rounded-2xl to give that universal modern rounded look
    content = content.replace(/rounded-md/g, 'rounded-2xl');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
