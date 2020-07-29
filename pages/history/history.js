// pages/repairList/repairList.js
//获取应用实例
var config = require('../../lib/js/config.js');
var baseURL = config.config().baseURL;
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
    pageSize: 10
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
    })
  },
  goback: function (e) {
    //返回d
    wx.switchTab({
      url: '../my/my'
    })
  },

  getUnfinsh: function (token, pageIndex_un, pageSize) {
    var that = this;
    wx.request({
      url: baseURL + '/sign/history/page',
      header: {
        "authorization": "Bearer " + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        pageIndex: pageIndex_un,
        pageSize: pageSize,
        type: "0"
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
        var datas = res.data.data;//res.data就是从后台接收到的值
        console.log(datas)
        const list = [];
        wx.hideLoading();
        that.setData({//循环完后，再对list进行赋值
          loading: false,
        })
        if (datas.length > 0) {
          for (var i = 0; i < datas.length; i++) {//用for循环把所有的时间戳都转换程时间格式，这里调用的是小程序官方demo中带的方法，
            datas[i]["examStartTime"] = common.getMyDate(datas[i]["examStartTime"]);
            if (datas[i].currState=='0'){
                datas[i]["state"]='未支付';
            }else{
              datas[i]["state"] = '支付完成';
            }
            list.push(datas[i]);
          }
          that.setData({//循环完后，再对list进行赋值
            list: list,
            // total_un: res.data.data.totalRecords,
            // unfinsh: false,//未完成
          })
        }else{
          that.setData({
            unfinsh:true
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
  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  //   var that = this;
  //   // 显示加载图标
  //   var pageIndex = that.data.pageIndex_un;//处理中
  //   var pageIndex_ed = that.data.pageIndex_ed; //已完成
  //   var token = that.data.token,
  //     pageSize = that.data.pageSize;
  //   var currentTab = that.data.currentTab;
  //   var total_un = that.data.total_un;  //处理中的总数量
  //   if (total_un % pageSize > 0) {
  //     var size = parseInt(total_un / pageSize) + 1
  //   } else {
  //     var size = parseInt(total_un / pageSize)
  //   }
  //   // 已完成的数量
  //   var total_ed = that.data.total_ed;
  //   if (total_ed % pageSize > 0) {
  //     var size_ed = parseInt(total_ed / pageSize) + 1
  //   } else {
  //     var size_ed = parseInt(total_ed / pageSize)
  //   }
  //   if (currentTab == 0) {
  //     pageIndex++;
  //     that.setData({
  //       pageIndex_un: pageIndex
  //     })
  //     if (pageIndex > size) {
  //       wx.hideLoading();
  //       return;
  //     } else {
  //       wx.showLoading({
  //         title: '玩命加载中',
  //       })
  //     }
  //     that.getUnfinsh(token, pageIndex, pageSize);
  //   } else {
  //     pageIndex_ed++;
  //     that.setData({
  //       pageIndex_ed: pageIndex_ed
  //     })
  //     if (pageIndex_ed > size_ed) {
  //       wx.hideLoading();
  //       return;
  //     } else {
  //       wx.showLoading({
  //         title: '玩命加载中',
  //       })
  //     }
  //     that.getFinshEd(token, pageIndex_ed, pageSize);
  //   }
  //   //wx.hideLoading();
  //   // 页数+1
  //   // page = page + 1;
  //   // if(){

  //   // }
  //   console.log(that.data.currentTab)
  // },
  // onPullDownRefresh: function () {
  //   // this.setData({ num: 10, count: -1, page: 0, list: [], hasmoreData: true, hiddenloading: true })
  //   // this.getList();
  //   // console.log('刷新数据')
  //   // wx.stopPullDownRefresh()
  // },
})