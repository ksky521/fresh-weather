// import {SERVER_URL} from '../config'

const QQ_MAP_KEY = 'ZVXBZ-xxxx-xxxx-xxxx-RCSVK-LQFU6'

wx.cloud.init({
  env: 'tianqi-xxxx'
})

const db = wx.cloud.database()

export const getEmotionByOpenidAndDate = (openid, year, month) => {
  const _ = db.command
  year = parseInt(year)
  month = parseInt(month)

  let start = new Date(year, month - 1, 1).getTime()
  let end = new Date(year, month, 1).getTime()
  // console.log(start, end, `${year}-${nextMonth}-01 00:00:00`,`${year}-${month}-01 00:00:00`)
  return db
    .collection('diary')
    .where({
      openid,
      tsModified: _.gte(start).and(_.lt(end))
    })
    .get()
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
