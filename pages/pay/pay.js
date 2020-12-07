import { getHeader } from "../../utils/util";
var config = require("../../lib/js/config.js");
var baseURL = config.config().baseURL;
var mediaURL = config.config().mediaURL;
var common = require("../../lib/js/common.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    date: "",
    address: "",
    payState: "去支付",
    group: [],
    signId: "",
    flag: true,
    loading: false,
    msgFlag: false,
    msgdata: "",
    totalFee: 0,
    qrCodeUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(555, options);
    var id = options.id;
    let that = this;
    that.setData({
      signId: id,
    });
    wx.getStorage({
      key: "token",
      success(res) {
        var token = res.data;
        that.getProcess(token, id);
        that.getQrCode(token, id);
      },
    });
  },
  getProcess: function (token, id) {
    var that = this;
    wx.request({
      url: baseURL + "/sign/history/item",
      header: getHeader(token),
      method: "get",
      data: {
        id: id,
      },
      success: function (res) {
        console.log(res);
        if (res.data.status == "403") {
          common.goToLogin(res.data.msg);
          return false;
        }
        let data = res.data.data;
        if (res.data.status == 1) {
          if (data.examStartTime) {
            var time = common.getMyDate1(data.examStartTime, 1);
          } else {
            var time = "";
          }
          that.setData({
            name: data.title,
            date: time,
            address: data.examAddress,
            group: data.signLevels,
            totalFee: data.totalFee,
          });
        }
      },
      fail: function (res) {
        console.log("submit fail");
      },
    });
  },
  getQrCode: function (token, id) {
    var that = this;
    wx.request({
      url: baseURL + "/exam/qrCodeUrl",
      header: getHeader(token),
      method: "get",
      data: {
        signId: id,
      },
      success: function (res) {
        that.setData({
          qrCodeUrl: mediaURL + res.data.data,
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  pay: function (e) {
    wx.navigateTo({
      url: "../sign/sign",
    });
  },
  paySuccess: function (e) {
    wx.navigateTo({
      url: "../sign/sign",
    });
  },
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
