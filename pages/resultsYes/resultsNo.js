// pages/resultsNo/resultsNo.js
var config = require('../../lib/js/config.js');
var baseURL = config.config().baseURL;
var mediaURL = config.config().mediaURL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageName:'成绩查询结果',
    userName:"",
    sex:"男",
    cordNumber:"",
    faceUrl:'../../image/index/home_bg_image.png',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.cordId;
    // var orderId = '510722201304278384';
    let that= this;
    wx.getStorage({
      key: 'token',
      success(res) {
        var token = res.data;
        that.getProcess(token, orderId);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getProcess: function (token, cardId) {
    var that = this;
    wx.request({
      url: baseURL + '/exam/result/list',
      header: {
        "authorization": "Bearer " + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        cardId: cardId,
      },
      success: function (res) {
        if (res.data.status == '403') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          wx.clearStorage()
          wx.navigateTo({
            url: '../sign/sign'
          })
          return false;
        }
        var datas = res.data.data;
        for (var i in datas) {
          
        }
        let sex='';
        if (datas.userStudent.gender == 0) {
          sex = '女';
        } else {
          sex = '男';
        }
        that.setData({
          list: datas.examinationResult,
          userName: datas.userStudent.name,
          cordNumber: datas.userStudent.cardId,
          sex: sex,
          faceUrl: mediaURL+datas.userStudent.faceUrl,
        })
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    })
  },
  navBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})