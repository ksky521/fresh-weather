// const path = require('path')
const API_URL = 'https://free-api.heweather.net/s6/air/now'
const request = require('request')
/*<jdists import="../../inline/utils.js" />*/

/*<remove>*/
const $ = require('../../inline/utils')
/*</remove>*/

exports.main = async (event) => {
  let location = event.city
  let params = {
    location,
    key: 'XXXXX' //和风天气中应用的密钥
  }
  let query = []
  for (let i in params) {
    query.push(`${i}=${encodeURIComponent(params[i])}`)
  }
  let url = API_URL + '?' + query.join('&')
  // console.log(url)
  return new Promise((resolve, reject) => {
    // console.log(url)
    request.get(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error)
      } else {
        try {
          let data = JSON.parse(body)
          // console.log(data)
          if (data && data.HeWeather6 && data.HeWeather6[0].air_now_city) {
            let {aqi, qlty} = data.HeWeather6[0].air_now_city
            resolve({
              status: 0,
              aqi,
              color: $.airBackgroundColor(aqi),
              name: qlty
            })
          } else {
            resolve({
              status: 500
            })
          }
          // resolve(rs)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}
