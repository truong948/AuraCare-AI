const fs = require('fs');
const https = require('https');

async function scrape(keyword) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/s/photos/${keyword}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const matches = [...data.matchAll(/https:\/\/images\.unsplash\.com\/photo-([a-zA-Z0-9-]+)\?/g)];
        const ids = [...new Set(matches.map(m => m[1]))].slice(0, 30);
        resolve(ids);
      });
    }).on('error', reject);
  });
}

async function main() {
  const medicineIds = await scrape('medicine-pills');
  const personalCareIds = await scrape('shampoo-bottle');
  const medicalDeviceIds = await scrape('thermometer');
  
  const result = {
    medicine: medicineIds,
    "personal-care": personalCareIds,
    "medical-devices": medicalDeviceIds
  };
  
  fs.writeFileSync('unsplash-ids.json', JSON.stringify(result, null, 2));
  console.log("Done");
}

main();
