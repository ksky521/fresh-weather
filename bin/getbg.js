const request = require('request')

const result = []

let lastName = ''
function get(name, next) {
  let options = {
    timeout: 3000,
    url: `https://m.sm.cn/s?q=${encodeURIComponent(`${name}天气`)}`,
    headers: {
      Connection: 'keep-alive',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      Host: 'm.sm.cn',
      Referer: `https://m.sm.cn/s?q=${encodeURIComponent(`${lastName}天气`)}&from=smor&safe=1&by=submit`,
      Cookie:
        'sm_uuid=c6fee50fef3812355e60bcbc4f6d7790%7C%7C%7C1531967632; sm_diu=c6fee50fef3812355e60bcbc4f6d7790%7C%7C12ede260495dea8232%7C1531967632; sec=5b5a8068a388878ec4dceae453fa900f261af831; lserr=1; sm_sid=4763c8b0669c2602bb479bbcf9538f83; phid=4763c8b0669c2602bb479bbcf9538f83; isg=BBYWuBtaUbtcAWUKRuN8V0SJZ8q0r-RMGwS4XYB_AvmUQ7bd6EeqAXwx35kKa1IJ'
    }
  }
  // referer 修改
  lastName = name
  request(options, function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body)
      //http://sm01.alicdn.com/L1/272/6837/static/wap/img/sc/weather_lg_v2/night/qing_173868_.jpg"
      let m = body.match(/(http[s]?:\/\/sm01\.alicdn\.com\/L1\/(\d+)\/(\d+)\/static\/wap\/img\/sc\/weather_lg_v2\/(day|night)\/(\w+)_([0-9a-zA-Z]{6})_\.jpg)/)
      // console.log(m[1])
      if (m && m[1] && !~result.indexOf(m[1])) {
        result.push(m[1])
      } else if (!m) {
        console.log(`出错========>${name}`)
      }
    }
    next && next()
  })
}

// -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7' -H 'Cookie: ' --compressed
let _city = []
const fs = require('fs')
const content = fs.readFileSync(`${__dirname}/global.txt`)
_city = content.toString().split('\n')
// const citys = require('./city.json')

// for (let i of citys) {
//   _city = _city.concat(i.list)
// }

function loop() {
  index++
  if (index < _city.length) {
    setTimeout(() => {
      get(_city[index], loop)
    }, 2000)
  } else {
    console.log(result)
  }
}

let index = 0
get(_city[index], loop)
// get('上海')
