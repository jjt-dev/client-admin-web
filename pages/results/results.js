// pages/results/results.js
var config = require("../../lib/js/config.js");
const common = require("../../lib/js/common.js");
var baseURL = config.config().baseURL;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    number: null,
    token: "",
    loading: false,
    title: "查询中",
    cardIdIndex: null,
    cardIds: [{ id: -1, cardId: "手动输入" }],
    isUserInput: false,
  },
  bindinput: function (e) {
    this.setData({
      number: e.detail.value,
      cardIdIndex: null,
    });
  },

  search: function () {
    const { number, cardIdIndex, cardIds } = this.data;
    let cardId = number;
    if (cardIdIndex !== null) {
      cardId = cardIds[cardIdIndex].cardId;
    }
    this.searchStduent(cardId);
  },

  searchStduent: function (cardId) {
    var that = this;
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

  pickerCardId: function (e) {
    let cardIdIndex = e.detail.value;
    let isUserInput = Number(cardIdIndex) === this.data.cardIds.length - 1;
    this.setData({
      cardIdIndex,
      number: null,
      isUserInput,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: "token",
      success(res) {
        wx.request({
          url: baseURL + "/sign/history/cardIds",
          header: {
            authorization: "Bearer " + res.data,
            "content-type": "application/x-www-form-urlencoded",
          },
          method: "get",
          success: function (res) {
            that.setData({
              cardIds: res.data.data.concat(that.data.cardIds),
              isUserInput: res.data.data.length === 0,
            });
          },
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
