// pages/sign/sign.js
var config = require("../../lib/js/config.js");
var utils = require("../../lib/js/common");
var baseURL = config.config().baseURL;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    avatarUrl: "",
    logoFlag: false,
    tokenFlag: true,
    examCode: null,
  },
  newSign: function () {
    wx.getStorage({
      key: "examCode",
      success(res) {
        console.log("stored examcode", res.data);
        wx.navigateTo({
          url: "../../pages/coach/coach?examCode=" + res.data,
        });
      },
    });
  },
  // 报名历史
  history: function (e) {
    wx.navigateTo({
      url: "../../pages/history/history",
    });
  },
  // 查询
  search: function (e) {
    wx.navigateTo({
      url: "../../pages/results/results",
    });
  },
  //token检测
  tokenF: function () {
    wx.showToast({
      title: "未登录，请先登录",
      icon: "none",
      duration: 2000,
    });
  },
  bindGetUserInfo: utils.throttle(function (e) {
    var that = this;
    if (e.detail.userInfo) {
      wx.showLoading({
        title: "登录中，请稍等",
      });
      wx.setStorage({
        key: "nickName",
        data: e.detail.userInfo.nickName,
      });
      wx.setStorage({
        key: "avatarUrl",
        data: e.detail.userInfo.avatarUrl,
      });
    }
    wx.login({
      success: function (r) {
        var code = r.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              console.log({
                encryptedData: res.encryptedData,
                iv: res.iv,
                code: code,
              });
              //3.解密用户信息 获取unionId
              wx.request({
                url: baseURL + "/common/wxsp/decode/userInfo",
                header: {
                  "content-type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code,
                },
                success: function (res) {
                  console.log(res);
                  wx.hideLoading();
                  if (res.data.status == 1) {
                    wx.showToast({
                      title: "登陆成功",
                      icon: "none",
                      duration: 2000,
                    });
                    // 保存unionId
                    if (res.data.data.token) {
                      wx.setStorage({
                        key: "token",
                        data: res.data.data.token,
                      });
                    }
                    that.setData({
                      tokenFlag: false,
                      userName: res.data.data.userInfo.nickName,
                      avatarUrl: res.data.data.userInfo.avatarUrl,
                    });
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: "none",
                      duration: 2000,
                    });
                  }
                },
              });
              // wx.switchTab({
              //   url: '../../pages/home/index',
              // })
            },
            fail: function () {
              console.log("获取用户信息失败");
            },
          });
        } else {
          console.log("获取用户登录态失败！" + r.errMsg);
        }
      },
      fail: function () {
        callback(false);
      },
    });
  }, 1000),
  /**
   * 生命周期函数--监听页面加载 用户通过扫码直接打开小程序
   * 扫码的链接是https://jjt2.top?examCode=fasdfasdfasdfasdfasdfasdf
   * 通过options.q获取到上面的链接进而获取到examCode
   */
  onLoad: function (options) {
    var that = this;
    const examCode = decodeURIComponent(options.q).split("=")[1];
    if (examCode) {
      wx.setStorage({
        key: "examCode",
        data: decodeURIComponent(options.q).split("=")[1],
      });
    }

    wx.getSetting({
      success: function (res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getStorage({
            key: "token",
            success(res) {
              that.setData({ tokenFlag: false });
            },
            fail(res) {
              that.setData({ tokenFlag: true });
            },
          });
        } else {
        }
      },
    });

    wx.getStorage({
      key: "nickName",
      success(res) {
        that.setData({
          userName: res.data,
        });
      },
    });

    wx.getStorage({
      key: "avatarUrl",
      success(res) {
        that.setData({
          avatarUrl: res.data,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
