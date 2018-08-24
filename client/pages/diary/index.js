/*<remove trigger="prod">*/
import {jscode2session} from '../../lib/api-mock'
import {getEmotionByOpenidAndDate, addEmotion} from '../../lib/api'
/*</remove>*/

/*<jdists trigger="prod">
import {getEmotionByOpenidAndDate, addEmotion, jscode2session} from '../../lib/api'
</jdists>*/

import {dateFormat} from '../../lib/utils'

const app = getApp()
const globalData = app.globalData
Page({
  data: {
    avatarUrl: globalData.avatarUrl,
    nickname: globalData.nickname,
    auth: -1,
    daysStyle: [],
    todayEmotion: '',
    activeEmotion: 'serene',
    emotions: ['serene', 'hehe', 'ecstatic', 'sad', 'terrified'],
    colors: {
      serene: '#64d9fe',
      hehe: '#d3fc1e',
      ecstatic: '#f7dc0e',
      sad: '#ec238a',
      terrified: '#ee1aea'
    }
  },
  dateChange(e) {
    // console.log(e)
    let {currentYear, currentMonth} = e.detail
    this.setData({
      daysStyle: []
    })
    this.setCalendarColor(currentYear, currentMonth)
  },
  checkedColor(e) {
    let activeEmotion = e.currentTarget.dataset.emotion
    this.setData({
      activeEmotion
    })
  },
  getScope(success, fail, name = 'scope.userInfo') {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting[name]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          typeof success === 'function' && success()
        } else {
          typeof fail === 'function' && fail()
          // console.log('显示登录授权', this.data.auth)
          // 显示登录授权
        }
      }
    })
  },
  _getUserInfo(cb = () => {}) {
    wx.getUserInfo({
      success: (res) => {
        cb(res.userInfo)
      }
    })
  },
  getUserOpenId(success, fail) {
    wx.login({
      success: (res) => {
        jscode2session(res.code).then((res) => {
          let {openid = '', session_key = ''} = res.result || {}
          if (openid && session_key) {
            wx.setStorage({
              key: 'openid',
              data: openid
            })
            typeof success === 'function' && success(res)
          } else {
            //授权失败，显示登录按钮
            typeof fail === 'function' && fail()
          }
        })
      }
    })
  },
  _setDayData(data, year, month) {
    const colors = this.data.colors

    const styles = []
    const now = new Date()
    const today = dateFormat(now)
    let todayEmotion = ''

    data.forEach((v) => {
      let ts = v.tsModified
      let date = new Date(ts)
      let day = date.getDate()
      if (today === dateFormat(date)) {
        todayEmotion = v.emotion || ''
      }
      styles.push({
        month: 'current',
        day,
        color: 'black',
        background: colors[v.emotion]
      })
    })
    // console.log(styles, today)
    this.setData({
      lastMonth: `${year}-${('00' + month).slice(-2)}`,
      showPublish: true,
      todayEmotion,
      daysStyle: styles
    })
  },
  setCalendarColor(year, month) {
    year = year || new Date().getFullYear()
    month = month || new Date().getMonth() + 1

    getEmotionByOpenidAndDate(this.data.openid, year, month)
      .then((r) => {
        const data = r.data || []
        globalData.currentMonthData = data
        this._setDayData(data, year, month)
      })
      .catch((e) => {
        wx.showToast({
          title: '加载已签数据失败，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      })
  },
  getUserInfo() {
    // 如果不存在全局的数据，就获取
    if (!globalData.nickname || globalData.avatarUrl) {
      this._getUserInfo((rs) => {
        this.setData({
          nickname: rs.nickName,
          avatarUrl: rs.avatarUrl
        })
        globalData.nickname = rs.nickName
        globalData.avatarUrl = rs.avatarUrl
      })
    }

    const that = this
    let openid = wx.getStorageSync('openid')

    function callback() {
      that.setData({
        auth: 1,
        openid
      })
      if (globalData.currentMonthData && globalData.currentMonthData.length) {
        // 当前月份，存在缓存
        const now = new Date()
        that._setDayData(globalData.currentMonthData, now.getFullYear(), now.getMonth() + 1)
      } else {
        that.setCalendarColor()
      }
    }
    if (openid) {
      callback()
    } else {
      this.getUserOpenId(
        (res) => {
          // console.log(res.result)
          openid = res.result.openid
          callback()
        },
        () => {
          this.setData({auth: 0})
        }
      )
    }
  },
  submitEmotion() {
    let {openid, activeEmotion, colors} = this.data
    addEmotion(openid, activeEmotion)
      .then((r) => {
        if (r._id) {
          let styles = this.data.daysStyle || []
          let day = new Date().getDate()
          styles.push({
            month: 'current',
            day,
            color: 'black',
            background: colors[activeEmotion]
          })
          this.setData({
            daysStyle: styles,
            todayEmotion: activeEmotion
          })
          // 将今天数据更新到globalData
          if (globalData.currentMonthData.length) {
            globalData.currentMonthData.push({
              openid,
              emotion: activeEmotion,
              tsModified: Date.now()
            })
          }
        }
      })
      .catch((e) => {
        wx.showToast({
          title: '签到失败，请稍后再试',
          icon: 'none',
          duration: 3000
        })
      })
  },
  goBack() {
    wx.navigateBack()
  },
  onShareAppMessage() {
    return {
      title: '我发现一个好玩的小程序，分享给你看看！',
      path: '/pages/diary/index'
    }
  },

  onLoad(options) {
    this.setData({
      curMonth: dateFormat(new Date(), 'yyyy-MM')
    })
    this.getScope(this.getUserInfo, () => {
      this.setData({auth: 0})
    })
  }
})
