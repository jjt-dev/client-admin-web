//index.js
//获取应用实例
var scence = 0;
const app = getApp();
var config = require('../../lib/js/config.js');
console.log(config)
var baseURL = config.config().baseURL;
console.log(baseURL);
Page({
  data: {
    motto: '微信用户快速登录',
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: "",
      success: function () {
      },
      fail: function (err) {
      }
    });
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getStorage({
            key: 'token',
            success(res) {
              // wx.navigateTo({
              //   url: '../../pages/sign/sign',
              // })
            }
          });
        };
      }
    });
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo){
      wx.setStorage({
        key: 'nickName',
        data: e.detail.userInfo.nickName
      })
      wx.setStorage({
        key: 'avatarUrl',
        data: e.detail.userInfo.avatarUrl
      })
    }
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
              //3.解密用户信息 获取unionId
              wx.request({
                url: baseURL +'/common/wxsp/decode/userInfo',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.status == 1 ){
                    // 保存unionId
                    if (res.data.data.token){
                      wx.navigateTo({
                        url: '../../pages/sign/sign',
                      })
                      wx.setStorage({
                        key: 'token',
                        data: res.data.data.token
                      })
                    }else{
                      wx.navigateTo({
                        url: '../../pages/bindNumber/bindNumber',
                      })
                    }
                    
                  }
                },
              })
              // wx.switchTab({
              //   url: '../../pages/home/index',
              // })
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })
        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        callback(false)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
