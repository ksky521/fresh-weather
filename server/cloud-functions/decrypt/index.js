const API_URL = 'https://api.weixin.qq.com/sns/jscode2session'
const request = require('request')
/*<jdists import="../../inline/utils.js" />*/

/*<remove>*/
const $ = require('../../inline/utils')
/*</remove>*/

// https://github.com/chenyueban/wx_server/blob/6fc4605bda4c29e36cf2ddef4ef2192401c76995/models/decrypt/WXBizDataCrypt.js
exports.main = async (event) => {
  const data = {
    appid: appid,
    secret: secret,
    js_code: code,
    grant_type: 'authorization_code'
  }
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error)
      } else {
        try {
          const r = JSON.parse(body)
          resolve(r.data)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}
