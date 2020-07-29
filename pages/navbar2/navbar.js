// components/navbar/index.js
var config = require('../../lib/js/config.js');
var baseURL = config.config().baseURL;
var mediaURL = config.config().mediaURL;
var common = require('../../lib/js/common.js');
const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: String,
    showNav: {
      type: Boolean,
      value: true
    },
    showHome: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:1,
    imgsArr:[],
    imgconFlag:false,
    faceUrl:"",
    tempFilePaths:'',
    flag:false
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navH: App.globalData.navHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  //回退
  methods:{
    navBack: function (e) {
      wx.navigateBack({
        delta: 1
      })
    },
    // 上传头像
    //选择图片
    bind_phone: function (e) {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          if (tempFilePaths) {
            var imgsArrs = that.data.imgsArr;
            for (var j in tempFilePaths) {
              imgsArrs.push(tempFilePaths[j])
            }
            that.setData({
              imgsArr: imgsArrs,
              imgconFlag: true,
              flag:true,
              tempFilePaths: tempFilePaths
            });
            // count = tempFilePaths.length;
            var successUp = 0; //成功
            var failUp = 0; //失败
            var length = res.tempFilePaths.length; //总数
            var Upcount = 0; //第几张
            that.uploadOneByOne(res.tempFilePaths, successUp, failUp, Upcount, length);
          }
        }
      })
    },
    /**
   * 采用递归的方式上传多张
   */
    uploadOneByOne(imgPaths, successUp, failUp, count, length) {
      var that = this;
      var token = that.data.token;
      wx.uploadFile({
        url: mediaURL + '/jjtImage/common/uploadImage',
        filePath: imgPaths[count],
        name: 'file',
        header: {
          "authorization": "Bearer " + token,
          'content-type': 'multipart/form-data',
        },
        success: function (res) {
          successUp++;//成功+1
          var dataList = JSON.parse(res.data)
          if (dataList.status == 1) {
            that.setData({
              faceUrl: mediaURL+dataList.data
            })
          }
        },
        fail: function (e) {
          failUp++;//失败+1
        },
        complete: function (e) {
          count++;//下一张
          if (count == length) {
            //上传完毕，作一下提示
            console.log('上传成功' + successUp + ',' + '失败' + failUp);
          } else {
            //递归调用，上传下一张
            that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
            console.log('正在上传第' + count + '张');
          }
        }
      })
    },
  }

})

