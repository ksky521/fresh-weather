const API_URL = 'https://api.weixin.qq.com/sns/jscode2session'
const request = require('request')
const querystring = require('querystring')
/*<jdists import="../../inline/utils.js" />*/

/*<remove>*/
const $ = require('../../inline/utils')
/*</remove>*/

exports.main = async (event) => {
  let {code} = event
  let {id, sk} = $.getWechatAppConfig()
  const data = {
    appid: id,
    secret: sk,
    js_code: code,
    grant_type: 'authorization_code'
  }
  let url = API_URL + '?' + querystring.stringify(data)
  return new Promise((resolve, reject) => {
    request.get(url, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error)
      } else {
        try {
          const r = JSON.parse(body)
          resolve(r)
        } catch (e) {
          reject(e)
        }
      }
    })
  })
}
