const path = require('path')
const express = require('express')

const {PORT} = require('../config.server.json')
const heWeather = require('./cloud-functions/he-weather/').main
const heAir = require('./cloud-functions/he-air/').main
const jscode2session = require('./cloud-functions/jscode2session/').main
const decrypt = require('./cloud-functions/decrypt/').main

const app = express()

// 添加static
app.use(
  '/static',
  express.static(path.join(__dirname, 'static'), {
    index: false,
    maxage: '30d'
  })
)
// 添加中间件

app.get('/api/he-weather', (req, res, next) => {
  heWeather(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
})
app.get('/api/he-air', (req, res, next) => {
  heAir(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

app.get('/api/jscode2session', (req, res, next) => {
  jscode2session(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

app.get('/api/decrypt', (req, res, next) => {
  decrypt(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})

const test = require('./cloud-functions/test/').main

app.get('/api/test', (req, res, next) => {
  // 将 req.query 传入
  test(req.query).then(res.json.bind(res)).catch((e) => {
    console.error(e)
    next(e)
  })
  // next()
})
app.listen(PORT, () => {
  console.log(`开发服务器启动成功：http://127.0.0.1:${PORT}`)
})
