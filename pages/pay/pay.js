// pages/pay/pay.js
// pages/signUp/sign.js
var config = require('../../lib/js/config.js');
var baseURL = config.config().baseURL;
var mediaURL = config.config().mediaURL;
var common = require('../../lib/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    date:'',
    address:'',
    payState:'去支付',
    group:[],
    signId:'',
    flag:true,
    loading:false,
    msgFlag: false,
    msgdata:'',
    totalFee:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    // var id = 31;
    // var examCode = '248e29b8f7571d9cb9442e081f70c00a';
    let that = this;
    that.setData({
      signId:id
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        var token = res.data;
        that.getProcess(token, id);
      }
    })
  },
  getProcess: function (token, id) {
    var that = this;
    wx.request({
      url: baseURL + '/sign/history/item',
      header: {
        "authorization": "Bearer " + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        id: id,
      },
      success: function (res) {
        console.log(res);
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
        let data = res.data.data;
        if (res.data.status == 1) {
          if (data.examStartTime) {
            var time = common.getMyDate1(data.examStartTime, 1)
          } else {
            var time = '';
          }
          that.setData({
            name: data.title,
            date: time,
            address: data.examAddress,
            group: data.signLevels,
            totalFee: data.totalFee
          })
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  pay:function(e){
    wx.navigateTo({
      url: '../sign/sign'
    })

    // var that=this;
    // that.setData({
    //   loading:true
    // })
    // wx.getStorage({
    //   key: 'token',
    //   success(res) {
    //     var token = res.data;
    //     var signId = that.data.signId;
    //     wx.request({
    //       url: baseURL + '/pay/fee',
    //       header: {
    //         "authorization": "Bearer " + token,
    //         'content-type': 'application/x-www-form-urlencoded',
    //       },
    //       method: 'POST',
    //       data: {
    //         signId: signId,
    //       },
    //       success: function (res) {
    //         console.log(res);
    //         let data = res.data.data;
    //         that.setData({
    //           loading: false
    //         })
    //         if (res.data.status == 1) {
    //           wx.requestPayment(
    //             {
    //               'timeStamp': data.timestamp,
    //               'nonceStr': data.nonceStr,
    //               'package': 'prepay_id=' + data.prepayId,
    //               'signType': 'MD5',
    //               'paySign': data.paySign,
    //               'success': function (res) {
    //                   that.setData({
    //                     flag:false,
    //                   })
    //               },
    //               'fail': function (res) { 
    //                 console.log(res)
    //               },
    //               'complete': function (res) { 
    //                 console.log(res)
    //               }
    //             })
    //         }else{
    //           that.setData({
    //             msgFlag:true,
    //             msgdata: res.data.msg
    //           })
    //           setTimeout(function () {
    //             that.setData({
    //               msgFlag: false,
    //               msgdata: ""
    //             })
    //           }, 1000)
    //         }
    //       },
    //       fail: function (res) {
    //         console.log('submit fail');
    //       },
    //     })
    //   }
    // })
  },
  paySuccess:function(e){
    wx.navigateTo({
      url: '../sign/sign'
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