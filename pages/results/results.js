// pages/results/results.js
var config = require("../../lib/js/config.js");
const common = require("../../lib/js/common.js");
var baseURL = config.config().baseURL;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: "",
    token: "",
    loading: false,
    title: "查询中",
  },
  bindinput: function (e) {
    this.setData({
      number: e.detail.value,
    });
  },
  /**
   * 搜索
   */
  search: function (e) {
    var that = this;
    let cardId = this.data.number;
    this.setData({
      loading: true,
    });
    wx.getStorage({
      key: "token",
      success(res) {
        wx.request({
          url: baseURL + "/exam/result/list",
          header: {
            authorization: "Bearer " + res.data,
            "content-type": "application/x-www-form-urlencoded",
          },
          method: "get",
          data: {
            cardId: cardId,
          },
          success: function (res) {
            that.setData({
              loading: false,
            });
            if (res.data.status == 1) {
              wx.navigateTo({
                url: "../resultsYes/resultsNo?cordId=" + cardId,
              });
            } else {
              if (res.data.status == "403") {
                common.goToLogin(res.data.msg);
              } else {
                wx.navigateTo({
                  url: "../resultsNo/resultsNo",
                });
              }
            }
          },
        });
      },
    });
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
