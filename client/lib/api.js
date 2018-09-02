// import {SERVER_URL} from '../config'
import Promise from './bluebird'

const QQ_MAP_KEY = 'ZVXBZ-xxxxxxxxxxxxxxxxxxx-RCSVK-LQFU6'

wx.cloud.init({
  env: 'tianqi-xxxxx'
})

const db = wx.cloud.database()

export const getEmotionByOpenidAndDate = (openid, year, month) => {
  const _ = db.command
  year = parseInt(year)
  month = parseInt(month)
  const now = new Date()
  const curMonth = now.getMonth()
  const curYear = now.getFullYear()
  const curDay = now.getDate()
  let start = new Date(year, month - 1, 1).getTime()
  let end = new Date(year, month, 1).getTime()
  // console.log(curYear, curDay, curMonth)
  if (month - 1 === curMonth && curDay <= 20 && year === curYear) {
    // 如果是当前月份并且天数少于20，那么就一次取出
    return db
      .collection('diary')
      .where({
        openid,
        tsModified: _.gte(start).and(_.lt(end))
      })
      .get()
  }

  // 这里因为限制 limit20，所以查询两次，一共31条（最多31天）记录
  return new Promise((resolve, reject) => {
    Promise.all([
      db
        .collection('diary')
        .where({
          openid,
          tsModified: _.gte(start).and(_.lt(end))
        })
        .orderBy('tsModified', 'desc')
        .limit(15)
        .get(),
      db
        .collection('diary')
        .where({
          openid,
          tsModified: _.gte(start).and(_.lt(end))
        })
        .orderBy('tsModified', 'asc')
        .limit(16)
        .get()
    ])
      .then((data) => {
        let [data1, data2] = data
        let set = new Set()
        data1 = data1.data || []
        data2 = data2.data || []
        data = data1.concat(data2).filter((v) => {
          if (set.has(v._id)) {
            return false
          }
          set.add(v._id)
          return true
        })
        resolve({data})
      })
      .catch((e) => {
        reject(e)
      })
  })
}
export const addEmotion = (openid, emotion) => {
  return db.collection('diary').add({
    data: {
      openid,
      emotion,
      tsModified: Date.now()
    }
  })
}

/**
 *  逆经纬度查询
 * @param {*} lat
 * @param {*} lon
 */
export const geocoder = (lat, lon, success = () => {}, fail = () => {}) => {
  return wx.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      location: `${lat},${lon}`,
      key: QQ_MAP_KEY,
      get_poi: 0
    },
    success,
    fail
  })
}
/**
 * 调用微信接口获取openid
 * @param {*} code
 */
export const jscode2session = (code) => {
  return wx.cloud.callFunction({
    name: 'jscode2session',
    data: {
      code
    }
  })
}
/**
 * 获取心情
 */
export const getMood = (province, city, county, success = () => {}) => {
  return wx.request({
    url: 'https://wis.qq.com/weather/common',
    data: {
      source: 'wxa',
      weather_type: 'tips',
      province,
      city,
      county
    },
    success
  })
}
/**
 * 获取和风天气
 * @param {*} lat
 * @param {*} lon
 */
export const getWeather = (lat, lon) => {
  return wx.cloud.callFunction({
    name: 'he-weather',
    data: {
      lat,
      lon
    }
  })
}
/**
 * 获取和风空气质量
 * @param {*} city
 */
export const getAir = (city) => {
  return wx.cloud.callFunction({
    name: 'he-air',
    data: {
      city
    }
  })
}
