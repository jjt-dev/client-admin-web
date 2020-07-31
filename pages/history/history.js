// pages/repairList/repairList.js
//获取应用实例
var config = require("../../lib/js/config.js");
var baseURL = config.config().baseURL;
//声明js
var time = require("../../utils/util.js");
var common = require("../../lib/js/common.js");
var app = getApp();
Page({
  data: {
    //全局变量
    list: [],
    listFinsh: [],
    //加载样式是否显示
    loading: false,
    navbar: ["处理中", "已完成"],
    currentTab: 0,
    unfinsh: false, //未完成
    finshed: true, //已完成
    token: "",
    pageIndex_un: 1,
    pageIndex_ed: 1,
    total_un: 0, //处理中的总数量
    total_ed: 0, //已完成的总数量
    pageSize: 10,
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
    });
  },
  goback: function (e) {
    //返回d
    wx.switchTab({
      url: "../my/my",
    });
  },

  getUnfinsh: function (token, pageIndex_un, pageSize) {
    var that = this;
    wx.request({
      url: baseURL + "/sign/history/page",
      header: {
        authorization: "Bearer " + token,
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "get",
      data: {
        pageIndex: pageIndex_un,
        pageSize: pageSize,
        type: "0",
      },
      success: function (res) {
        if (res.data.status == "403") {
          common.goToLogin(res.data.msg);
          return false;
        }
        var datas = res.data.data; //res.data就是从后台接收到的值
        console.log(datas);
        const list = [];
        wx.hideLoading();
        that.setData({
          //循环完后，再对list进行赋值
          loading: false,
        });
        if (datas.length > 0) {
          for (var i = 0; i < datas.length; i++) {
            //用for循环把所有的时间戳都转换程时间格式，这里调用的是小程序官方demo中带的方法，
            datas[i]["examStartTime"] = common.getMyDate(
              datas[i]["examStartTime"]
            );
            if (datas[i].currState == "0") {
              datas[i]["state"] = "未支付";
            } else {
              datas[i]["state"] = "支付完成";
            }
            list.push(datas[i]);
          }
          that.setData({
            //循环完后，再对list进行赋值
            list: list,
            // total_un: res.data.data.totalRecords,
            // unfinsh: false,//未完成
          });
        } else {
          that.setData({
            unfinsh: true,
          });
        }
      },
      fail: function (res) {
        console.log("submit fail");
      },
      complete: function (res) {
        console.log("submit complete");
      },
    });
  },
  onLoad: function (options) {
    var that = this; //很重要，一定要写
    wx.getStorage({
      key: "token",
      success(res) {
        that.setData({
          token: res.data,
        });
        var token = res.data;
        var pageIndex_un = that.data.pageIndex_un,
          pageSize = that.data.pageSize;
        var pageIndex_ed = that.data.pageIndex_ed;
        that.getUnfinsh(token, pageIndex_un, pageSize);
      },
    });
  },
});
