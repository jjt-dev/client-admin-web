// pages/repairList/repairList.js
//获取应用实例
var config = require('../../lib/js/config.js');
var baseURL = config.config().baseURL;
var mediaURL = config.config().mediaURL;
//声明js
var time = require('../../utils/util.js');
var common = require('../../lib/js/common.js');
var app = getApp();
Page({
  data: {
    //全局变量
    list: [],
    listFinsh: [],
    //加载样式是否显示
      loading: false,
    navbar: ['处理中', '已完成',],
    currentTab: 0,
    unfinsh: false,//未完成
    finshed: true,//已完成
    token: "",
    pageIndex_un: 1,
    pageIndex_ed: 1,
    total_un: 0,//处理中的总数量
    total_ed: 0,//已完成的总数量
    pageSize: 10,
    examCode:'',
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
  },
  getUnfinsh: function (token, pageIndex_un, pageSize) {
    var that = this;
    let examCode = that.data.examCode;
    wx.request({
      url: baseURL + '/sign/coachList',
      header: {
        "authorization": "Bearer " + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        examCode: examCode
      },
      success: function (res) {
        var datas = res.data.data;//res.data就是从后台接收到的值
        console.log(datas)
        const list = that.data.list;
        wx.hideLoading();
        that.setData({//循环完后，再对list进行赋值
          loading: false,
        })
        if (res.data.status == '404') {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            unfinsh: true
          })
          return false;
        }
        if (datas.length > 0) {
          for (var i = 0; i < datas.length; i++) {
            if (datas[i].faceUrl){
              datas[i].faceUrl = mediaURL + datas[i].faceUrl;
            }else{
              datas[i].faceUrl = '../../image/index/nav_bg_images.png'
            }
            datas[i].examCode = that.data.examCode;
            list.push(datas[i]);
          }
          that.setData({//循环完后，再对list进行赋值
            list: list,
          })
        }
      },
      fail: function (res) {
        console.log('submit fail');
      },
      complete: function (res) {
        console.log('submit complete');
      }
    });
  },
  onLoad: function (options) {
    var examCode = options.examCode;
    // var examCode='248e29b8f7571d9cb9442e081f70c00a';
    this.setData({
      examCode: examCode
    })
    var that = this;     //很重要，一定要写
    wx.getStorage({
      key: 'token',
      success(res) {
        that.setData({
          token: res.data
        })
        var token = res.data;
        var pageIndex_un = that.data.pageIndex_un,
          pageSize = that.data.pageSize;
        var pageIndex_ed = that.data.pageIndex_ed;
        that.getUnfinsh(token, pageIndex_un, pageSize);
      }
    });
  },
})