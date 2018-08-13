const imgs = [
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/night/yu_284469_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/night/duoyun_27446f_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/day/yu_2f4484_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/night/leiyu_2a2b5a_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/night/qing_173868_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/night/xue_7a98bc_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/day/qing_57b9e2_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/day/duoyun_62aadc_.jpg',
  'http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/day/leiyu_3a4482_.jpg'
];
const request = require('request');
const fs = require('fs');
const path = require('path');

imgs.forEach((url) => {
  let m = url.match(/(day|night)\/(\w+)_(\w+)_\.jpg$/);
  // console.log(m);
  let filepath = path.join(__dirname, 'bg', m[1], `${m[2]}.jpg`);
  // console.log(`${m[1]}_${m[2]}:'${m[3]}'`);
  console.log(filepath)
  request
    .get(url)
    .on('end', (e) => {})
    .on('error', (e) => {
      // console.log(url);
    })
    .pipe(fs.createWriteStream(filepath));
});
