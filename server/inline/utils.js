const path = require('path')
const crypto = require('crypto')

/*<remove trigger="prod">*/
const STATIC_SERVER_URL = 'http://127.0.0.1:3000/static'
/*</remove>*/

/*<jdists trigger="prod">
const STATIC_SERVER_URL = 'https://tianqi-1d3bf9.tcb.qcloud.la'
</jdists>*/

const BACKGROUND_PERFIXER = `${STATIC_SERVER_URL}/bg`
const WEATHER_IMAGE_PERFIXER = `${STATIC_SERVER_URL}/icon`

const KEY = 'xxxxxxxxxxxx'   //和风天气中应用的key名称
const USER_ID = 'HE18888888888888899' //和风天气中应用的密钥ID

const WECHAT_APPID = 'wx8696xxxxxxxxxce6'
const WECHAT_APP_SECRET = '12wwwwwxxxxxxxxxxxxxxxx2'
const $ = {
  getWechatAppConfig: () => {
    return {
      id: WECHAT_APPID,
      sk: WECHAT_APP_SECRET
    }
  },
  airBackgroundColor: (aqi) => {
    if (aqi < 50) {
      return '#00cf9a'
    } else if (aqi < 100) {
      return '#00cf9a'
    } else if (aqi < 200) {
      return '#4295f4'
    } else if (aqi > 300) {
      return '#ff6600'
    }
  },
  generateSignature: (params) => {
    params.username = USER_ID
    let data =
      Object.keys(params)
        .filter((key) => {
          return params[key] !== '' && key !== 'sign' && key !== 'key'
        })
        .sort()
        .map((key) => {
          return `${key}=${params[key]}`
        })
        .join('&') + KEY
    return crypto.createHash('md5').update(data).digest('base64')
  },
  getWeatherImage(code, isNight) {
    return WEATHER_IMAGE_PERFIXER + '/' + path.join(isNight ? 'night' : 'day', `${code}.svg`)
  },
  getBackgroundImage(weather, isNight) {
    return BACKGROUND_PERFIXER + '/' + path.join(isNight ? 'night' : 'day', `${weather}.jpg`)
  },
  timeFormat(pattern = 'YYYY-MM-DD', d) {
    if (!(d instanceof Date)) {
      d = new Date()
    }
    let y = d.getFullYear().toString(),
      o = {
        M: d.getMonth() + 1, //month
        d: d.getDate(), //day
        h: d.getHours(), //hour
        m: d.getMinutes(), //minute
        s: d.getSeconds() //second
      }
    pattern = pattern.replace(/(y+)/gi, function(a, b) {
      return y.substr(4 - Math.min(4, b.length))
    })
    for (let i in o) {
      pattern = pattern.replace(new RegExp('(' + i + '+)', 'gi'), function(a, b) {
        return o[i] < 10 && b.length > 1 ? '0' + o[i] : o[i]
      })
    }
    return pattern
  },
  getIconNameByCode(code, isNight) {
    const nightMap = {
      '100': 'qingye',
      '200': 'qingye',
      '201': 'qingye',
      '202': 'qingye',
      '203': 'qingye',
      '204': 'qingye',
      '101': 'duoyunye',
      '102': 'duoyunye',
      '103': 'duoyunye',
      '300': 'zhenyuye',
      '301': 'zhenyuye',
      '302': 'zhenyuye',
      '303': 'zhenyuye',
      '304': 'zhenyuye',
      '305': 'zhenyuye',
      '306': 'zhenyuye',
      '307': 'zhenyuye',
      '308': 'zhenyuye',
      '309': 'zhenyuye',
      '310': 'zhenyuye',
      '311': 'zhenyuye',
      '312': 'zhenyuye',
      '313': 'zhenyuye',
      '314': 'zhenyuye',
      '315': 'zhenyuye',
      '316': 'zhenyuye',
      '399': 'zhenyuye',
      '317': 'zhenyuye',
      '318': 'zhenyuye',
      '400': 'zhenxueye',
      '401': 'zhenxueye',
      '402': 'zhenxueye',
      '403': 'zhenxueye',
      '404': 'zhenxueye',
      '405': 'zhenxueye',
      '406': 'zhenxueye',
      '407': 'zhenxueye',
      '408': 'zhenxueye',
      '409': 'zhenxueye',
      '410': 'zhenxueye',
      '499': 'zhenxueye'
    }
    const dayMap = {
      '100': 'qingbai',
      '101': 'duoyunbai',
      '102': 'duoyunbai',
      '103': 'duoyunbai',
      '104': 'yin',
      '201': 'qingye',
      '202': 'qingye',
      '203': 'qingye',
      '204': 'qingye',
      '205': 'fengli',
      '206': 'fengli',
      '207': 'fengli',
      '208': 'fengli',
      '209': 'yin',
      '210': 'yin',
      '211': 'yin',
      '212': 'yin',
      '213': 'yin',

      '300': 'zhenyubai',
      '301': 'zhenyubai',
      '302': 'leizhenyu',
      '303': 'leizhenyu',
      '304': 'leizhenyuzhuanbingbao',
      '305': 'xiaoyu',
      '306': 'zhongyu',
      '307': 'dayu',
      '308': 'tedabaoyu',
      '309': 'xiaoyu',
      '310': 'baoyu',
      '311': 'dabaoyu',
      '312': 'tedabaoyu',
      '313': 'dongyu',
      '314': 'xiaoyu',
      '315': 'zhongyu',
      '316': 'dayu',
      '317': 'baoyu',
      '318': 'dabaoyu',
      '399': 'xiaoyu',

      '400': 'xiaoxue',
      '401': 'zhongxue',
      '402': 'daxue',
      '403': 'baoxue',
      '404': 'yujiaxue',
      '405': 'yujiaxue',
      '406': 'yujiaxue',
      '407': 'zhenxuebai',
      '408': 'xiaoxue',
      '409': 'zhongxue',
      '410': 'daxue',
      '499': 'xiaoxue',

      '500': 'wu',
      '501': 'wu',
      '502': 'wumaibai',
      '503': 'yangsha',
      '504': 'yangsha',
      '507': 'shachenbao',
      '508': 'qiangshachenbao',
      '509': 'wu',
      '510': 'wu',
      '511': 'wumaibai',
      '512': 'wumaibai',
      '513': 'wumaibai',
      '514': 'wu',
      '515': 'wu',

      '900': 'qingbai',
      '901': 'qingbai',
      '902': 'yin'
    }
    if (isNight && nightMap[code]) {
      return nightMap[code]
    }
    return dayMap[code] ? dayMap[code] : 'yin'
  },
  getWeatherName(code) {
    code = parseInt(code)
    let result = 'rain'
    if (code === 100 || (code >= 200 && code <= 204)) {
      result = 'clear'
    } else if (code > 100 && code <= 103) {
      result = 'cloud'
    } else if (code === 104 || (code >= 205 && code <= 208)) {
      result = 'overcast'
    } else if (code >= 302 && code <= 304) {
      result = 'thunder'
    } else if (code >= 400 && code < 500) {
      result = 'snow'
    } else if ((code >= 511 && code <= 513) || code === 502) {
      result = 'smog'
    } else if (code === 501 || (code >= 514 && code <= 515) || (code >= 509 && code <= 510)) {
      // 这个是雾气
      result = 'smog'
    } else if (code >= 503 && code < 508) {
      // 扬沙
      result = 'smog'
    } else if (code >= 900) {
      result = 'clear'
    }
    return result
  },
  getEffectSettings(code) {
    // return {
    //   name: 'rain',
    //   amount: 100
    // }
    code = parseInt(code)
    let result = false

    if ((code >= 300 && code <= 304) || code === 309 || code === 313 || code == 399 || code === 406 || code === 404) {
      result = {
        name: 'rain',
        amount: 100
      }
    } else if (code === 499 || code === 405) {
      result = {
        name: 'snow',
        amount: 70
      }
    } else if (code >= 305 && code <= 312) {
      let amount = 100 + (code - 305) * 10
      result = {
        name: 'rain',
        amount: amount
      }
    } else if (code >= 314 && code <= 318) {
      let amount = 100 + (code - 314) * 10
      result = {
        name: 'rain',
        amount: amount
      }
    } else if (code >= 400 && code <= 403) {
      let amount = 60 + (code - 400) * 10
      result = {
        name: 'snow',
        amount: amount
      }
    } else if (code >= 407 && code <= 410) {
      let amount = 60 + (code - 407) * 10
      result = {
        name: 'snow',
        amount: amount
      }
    }

    return result
  },
  /**
 * 获取背景色颜色
 * @param {} name
 * @param {*} night
 */
  getBackgroundColor(name, night = 'day') {
    name = `${night}_${name}`
    const map = {
      day_cloud: '62aadc',
      night_cloud: '27446f',
      day_rain: '2f4484',
      night_rain: '284469',
      day_thunder: '3a4482',
      night_thunder: '2a2b5a',
      day_clear: '57b9e2',
      night_clear: '173868',
      day_overcast: '5c7a93',
      night_overcast: '22364d',
      day_snow: '95d1ed',
      night_snow: '7a98bc',

      night_smog: '494d57'
    }
    let color = map[name] ? map[name] : '27446f'
    return `#${color}`
  },
  getOneWord(code) {
    const list = [
      '生活是天气，有阴有晴有风雨',
      '心怀感恩，幸福常在',
      '心累的时候，换个心情看世界',
      '想获得人生的金子，就必须淘尽生活的沙烁',
      '因为有明天，今天永远只是起跑线',
      '只要心情是晴朗的，人生就没有雨天',
      '有你的城市下雨也美丽',
      '雨划过我窗前，玻璃也在流眼泪',
      '天空澄碧，纤云不染',
      '人生，不要被安逸所控制',
      '在受伤的时候，也能浅浅的微笑',
      '不抱怨过去，不迷茫未来，只感恩现在',
      '生活向前，你向阳光',
      '在阳光中我学会欢笑，在阴云中我学会坚强'
    ]
    let index = Math.floor(Math.random() * list.length)
    return list[index] ? list[index] : list[0]
  },

  _isNight: (now, sunrise, sunset) => {
    sunrise = parseInt(sunrise) + 1
    sunset = parseInt(sunset)
    let isNight = false
    if (now > sunset) {
      isNight = true
    } else if (now < sunrise) {
      isNight = true
    }
    return isNight
  },
  _now: (data, _data) => {
    let {fl, wind_dir, wind_sc, hum, cond_txt, cond_code} = data
    let {sr, ss} = _data.daily_forecast[0]
    let hours = new Date().getUTCHours() + 8
    if (hours > 24) {
      hours -= 24
    }
    let isNight = $._isNight(hours, sr, ss)
    let name = $.getWeatherName(cond_code)
    return {
      backgroundImage: $.getBackgroundImage(name, isNight),
      backgroundColor: $.getBackgroundColor(name, isNight ? 'night' : 'day'),
      temp: fl,
      wind: wind_dir,
      windLevel: wind_sc,
      weather: cond_txt,
      humidity: hum,
      // tips: tips ? tips : '每天都有好心情',
      icon: $.getIconNameByCode(cond_code, isNight),
      ts: _data.update.loc
    }
  },
  _hourly: (data, _data) => {
    let hourly = []
    let {sr, ss} = _data.daily_forecast[0]

    for (let i = 0; i < data.length; i++) {
      let r = data[i]
      if (!r || !r.time) {
        break
      }
      let time = r.time
      let hours = time.slice(11, 13)

      let isNight = $._isNight(hours, sr, ss)

      hourly.push({
        temp: r.tmp,
        // ts: time,
        time: hours + ':00',
        weather: r.cond_txt,
        icon: $.getIconNameByCode(r.cond_code, isNight)
      })
    }

    return hourly
  },
  _daily: (data) => {
    let weekly = []
    for (let i = 0; i <= 6; i++) {
      let r = data[i]
      weekly.push({
        day: r.cond_txt_d,
        dayIcon: $.getIconNameByCode(r.cond_code_d),
        dayWind: r.wind_dir,
        dayWindLevel: r.wind_sc,
        maxTemp: r.tmp_max,
        minTemp: r.tmp_min,
        night: r.cond_txt_n,
        nightIcon: $.getIconNameByCode(r.cond_code_n, true),
        nightWind: r.wind_dir,
        nightWindLevel: r.wind_sc,
        time: new Date(r.date).getTime()
      })
    }

    return weekly
  },
  _lifestyle: (data) => {
    let arr = []
    const map = {
      cw: {
        icon: 'xichezhishu',
        name: '洗车'
      },
      sport: {
        icon: 'yundongzhishu',
        name: '运动'
      },
      flu: {
        icon: 'ganmao',
        name: '感冒'
      },
      uv: {
        icon: 'ziwaixian',
        name: '紫外线强度'
      },
      drsg: {
        icon: 'liangshai',
        name: '穿衣'
      },
      air: {
        icon: 'beikouzhao',
        name: '污染扩散'
      },

      trav: {
        icon: 'fangshai',
        name: '旅游'
      },
      comf: {
        icon: 'guominzhishu',
        name: '舒适度'
      }
    }
    data.forEach((v) => {
      let t = map[v.type]
      // console.log(v.type)
      arr.push({
        name: t.name,
        icon: t.icon,
        info: v.brf,
        detail: v.txt
      })
    })
    return arr
  },
  handlerData: (data) => {
    if (data && data.HeWeather6 && data.HeWeather6[0].now) {
      let result = data.HeWeather6[0]
      let {now, daily_forecast, lifestyle, hourly} = result
      return {
        status: 0,
        effect: $.getEffectSettings(now.cond_code),
        oneWord: $.getOneWord(now.cond_code),
        current: $._now(now, result),
        hourly: $._hourly(hourly, result),
        lifeStyle: $._lifestyle(lifestyle),
        daily: $._daily(daily_forecast, result)
      }
    } else {
      return {
        status: 500,
        msg: data.HeWeather6[0].status
      }
    }
  }
}

/*<remove>*/
module.exports = $
/*</remove>*/
