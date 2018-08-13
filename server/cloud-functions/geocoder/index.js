const QQ_MAP_KEY = 'ZVXBZ-D6JKU-4IRVY-2OHZB-RCSVK-LQFU6'
const API_URL = 'https://apis.map.qq.com/ws/geocoder/v1/'

const request = require('request')

exports.main = async (event) => {
  const {lat, lon} = event
  let location = `${lat},${lon}`
  let url = `${API_URL}?key=${QQ_MAP_KEY}&get_poi=0&location=${location}`
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject()
      } else {
        try {
          let rs = JSON.parse(body).result
          delete rs.address_reference
          delete rs.formatted_addresses, delete rs.location
          resolve(rs)
        } catch (e) {
          reject()
        }
      }
    })
  })
}
