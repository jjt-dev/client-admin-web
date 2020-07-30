// pages/signUp/sign.js
var config = require('../../lib/js/config.js')
var baseURL = config.config().baseURL
var mediaURL = config.config().mediaURL
var common = require('../../lib/js/common.js')
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currStateFlag: false,
    count: 1,
    imgsArr: [],
    imgconFlag: false,
    faceUrl: '',
    tempFilePaths: '',
    flag: false,
    date: '请选择日期',
    relationship: [
      '父亲',
      '母亲',
      '爷爷',
      '奶奶',
      '外婆',
      '外公',
      '姐姐',
      '哥哥',
    ],
    genderList: ['女', '男'],
    pickerIndex: 0,
    leveList: [], //等级数组
    pickerLeve: 0,
    pickerId: 0,
    pickerData: ['请选择单位', '请选择单位'],
    pickerDataList: ['请选择'],

    pickerIndex1: 0,
    pickerIndexId1: 0,
    pickerId1: 0,
    pickerData1: ['请选择单位', '请选择单位'],
    pickerDataList1: ['请选择'],

    pickerIndex2: 0,
    pickerIndexId2: 0,
    pickerId2: 0,
    pickerData2: ['请选择单位', '请选择单位'],
    pickerDataList2: ['请选择'],

    pickerIndex3: 0,
    pickerId3: 0,

    pickerIndex4: 0,
    pickerId4: 0,

    title: '',
    nowLeve: '请输入',
    // 性别
    gender: 0,
    id: '',
    // 学生家庭地址
    address: '',
    parentName: '',
    // 身份证号码
    cardId: '',
    // 教练id
    coachId: '',
    // 教练所带班级
    coachClasses: [],
    coachClassIndex: null,
    coachClassId: null,
    // 当前的级别
    currLevelId: '',
    // 考试的md5码
    examCode: '',
    // 头像url
    // faceUrl:'1111',

    // 报考等级
    levels: '',
    // 考生姓名
    name: '',
    // 备注
    note: '',
    // 家长姓名
    parentName: '',
    // 联系电话
    phone: '',
    // 报考人和考生的关系
    // relationship:'',
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
    })
  },
  pay: function (e) {
    wx.navigateTo({
      url: '../../pages/pay/pay',
    })
  },
  // 性别
  genderPicker: function (event) {
    let index = event.detail.value
    this.setData({
      gender: index,
    })
  },
  //选择单位
  pickerClick: function (event) {
    this.setData({
      pickerIndex: event.detail.value,
    })
  },
  // 选择当前级别
  pickerLeveClick1: function (event) {
    var index = event.detail.value
    var pickerDataList1 = this.data.pickerDataList1
    if (index == 0) {
      var pickerId = -1
    } else {
      var pickerId = pickerDataList1[index - 1].id
    }
    this.setData({
      pickerIndex1: event.detail.value,
      pickerId: pickerId,
      currLevelId: pickerId,
      nowLeve: pickerDataList1[index - 1].alias,
    })
  },

  pickerLeveClick2: function (event) {
    var index = event.detail.value
    var pickerDataList2 = this.data.pickerDataList2
    if (index == 0) {
      var pickerId2 = -1
    } else {
      var pickerId2 = pickerDataList2[index - 1].id
    }
    this.setData({
      pickerIndex2: event.detail.value,
      pickerId2: pickerId2,
    })
  },

  pickerLeveClick3: function (event) {
    var index = event.detail.value
    var pickerDataList2 = this.data.pickerDataList2
    if (index == 0) {
      var pickerId3 = -1
    } else {
      var pickerId3 = pickerDataList2[index - 1].id
    }
    this.setData({
      pickerIndex3: event.detail.value,
      pickerId3: pickerId3,
    })
  },

  pickerLeveClick4: function (event) {
    var index = event.detail.value
    var pickerDataList2 = this.data.pickerDataList2
    if (index == 0) {
      var pickerId4 = -1
    } else {
      var pickerId4 = pickerDataList2[index - 1].id
    }
    this.setData({
      pickerIndex4: event.detail.value,
      pickerId4: pickerId4,
    })
  },

  // 选择教练班级
  pickerCoachClass: function (event) {
    this.setData({
      coachClassIndex: event.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var examCode = options.examCode
    var currState = options.currState
    let that = this
    if (currState > 0) {
      that.setData({
        currStateFlag: false,
      })
    } else {
      that.setData({
        currStateFlag: true,
      })
    }
    that.setData({
      examCode: examCode,
    })
    wx.getStorage({
      key: 'token',
      success(res) {
        var token = res.data
        that.getProcess(token, id, examCode)
        that.getInfo(token, examCode)
        that.getProcess1(token, examCode)
      },
    })
  },
  getProcess1: function (token, examCode) {
    var that = this
    wx.request({
      url: baseURL + '/sign/levelList',
      header: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        examCode: examCode,
      },
      success: function (res) {
        var datas = res.data.data
        var pickerDataList = that.data.pickerDataList
        var pickerDataList1 = that.data.pickerDataList1
        var pickerDataList2 = that.data.pickerDataList2
        var pickerIndexId1 = that.data.pickerIndexId1
        var pickerIndexId2 = that.data.pickerId2
        var pickerIndexId3 = that.data.pickerId3
        var pickerIndexId4 = that.data.pickerId4
        for (var i = 0; i < datas.length; i++) {
          pickerDataList.push(datas[i].name)
          pickerDataList1.push(datas[i].name)
          pickerDataList2.push(datas[i].name)
          if (pickerIndexId4 == datas[i].id) {
            that.setData({
              pickerIndex4: i + 1,
            })
          }
          if (pickerIndexId3 == datas[i].id) {
            that.setData({
              pickerIndex3: i + 1,
            })
          }
          if (pickerIndexId2 == datas[i].id) {
            that.setData({
              pickerIndex2: i + 1,
            })
          }
          if (pickerIndexId1 == datas[i].id) {
            that.setData({
              pickerIndex1: i + 1,
            })
          }
        }
        if (datas.length > 0) {
          console.log(pickerDataList)
          var pickerId = '-1'
          that.setData({
            //循环完后，再对list进行赋值
            pickerData: pickerDataList,
            pickerDataList: datas,
            pickerId: pickerId,

            pickerData1: pickerDataList1,
            pickerDataList1: datas,
            pickerId1: pickerId,

            pickerData2: pickerDataList2,
            pickerDataList2: datas,
            pickerId2: pickerId,
          })
        }
        that.getProcess2(token, examCode)
      },
      fail: function (res) {
        console.log('submit fail')
      },
    })
  },
  getProcess2: function (token, examCode) {
    var that = this
    wx.request({
      url: baseURL + '/sign/canSignLevelList',
      header: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        examCode: examCode,
      },
      success: function (res) {
        var datas = res.data.data
        const canSignLevels = that.data.pickerData2.filter((name) =>
          datas.some((item) => item.name === name)
        )
        that.setData({
          pickerData2: canSignLevels,
        })
      },
      fail: function (res) {
        console.log('submit fail')
      },
    })
  },
  getProcess: function (token, id, examCode) {
    var that = this
    wx.request({
      url: baseURL + '/sign/history/item',
      header: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        id: id,
      },
      success: function (res) {
        console.log(res)
        let data = res.data.data
        if (res.data.status == 1) {
          if (data.birthday) {
            var birthday = common.getMyDate1(data.birthday, 1)
          } else {
            var birthday = ''
          }
          if (data.faceUrl) {
            that.setData({
              flag: true,
            })
          }
          that.setData({
            address: data.studentAddress,
            cardId: data.cardId,
            levels: data.signLevels[0].id,
            currLevelId: data.currLevelId,
            pickerIndex: data.gender,
            pickerIndexId1: data.currLevelId,
            pickerId2: data.signLevels[0].id,
            pickerId3: data.signLevels[1] ? data.signLevels[1].id : -1,
            pickerId4: data.signLevels[2] ? data.signLevels[2].id : -1,
            nowLeve: data.currLevelAlias,
            faceUrl: data.faceUrl,
            faceUrl1: mediaURL + data.faceUrl,
            gender: data.gender,
            name: data.name,
            parentName: data.parentName,
            phone: data.phone,
            id: data.signId,
            date: birthday,
            coachClassId: data.coachClassId,
            currLevelNum: data.currLevelNum,
            coachId: data.coachId,
          })
          that.getCoachClasses(token, examCode, data.coachId)
        }
      },
      fail: function (res) {
        console.log('submit fail')
      },
    })
  },
  getInfo: function (token, examCode) {
    var that = this
    wx.request({
      url: baseURL + '/sign/examInfo',
      header: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        examCode: examCode,
      },
      success: function (res) {
        const data = res.data
        if (data.status == 1) {
          let title =
            data.data.title +
            '(' +
            common.getMyDate1(data.data.examStartTime) +
            ')'
          that.setData({
            title: title,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      fail: function (res) {
        console.log('submit fail')
      },
    })
  },

  getCoachClasses: function (token, examCode, coachId) {
    var that = this
    wx.request({
      url: baseURL + '/sign/coachClassList',
      header: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'get',
      data: {
        examCode: examCode,
        coachId: coachId,
      },
      success: function (res) {
        const data = res.data

        if (data.status == 1) {
          const coachClassIndex = data.data.findIndex(
            (item) => item.id === that.data.coachClassId
          )
          that.setData({
            coachClasses: data.data,
            coachClassIndex: coachClassIndex,
          })
        }
      },
      fail: function (res) {
        console.log('submit fail')
      },
    })
  },

  address: function (e) {
    this.setData({
      address: e.detail.value,
    })
  },
  currLevelNum: function (e) {
    this.setData({
      currLevelNum: e.detail.value,
    })
  },
  navBack: function (e) {
    wx.navigateBack({
      delta: 1,
    })
  },
  // 上传头像
  //选择图片
  bind_phone: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        if (tempFilePaths) {
          var imgsArrs = that.data.imgsArr
          for (var j in tempFilePaths) {
            imgsArrs.push(tempFilePaths[j])
          }
          that.setData({
            imgsArr: imgsArrs,
            imgconFlag: true,
            flag: true,
            tempFilePaths: tempFilePaths,
          })
          // count = tempFilePaths.length;
          var successUp = 0 //成功
          var failUp = 0 //失败
          var length = res.tempFilePaths.length //总数
          var Upcount = 0 //第几张
          that.uploadOneByOne(
            res.tempFilePaths,
            successUp,
            failUp,
            Upcount,
            length
          )
        }
      },
    })
  },
  /**
   * 采用递归的方式上传多张
   */
  uploadOneByOne(imgPaths, successUp, failUp, count, length) {
    var that = this
    var token = that.data.token
    wx.uploadFile({
      url: mediaURL + '/jjtImage/common/uploadImage',
      filePath: imgPaths[count],
      name: 'file',
      header: {
        authorization: 'Bearer ' + token,
        'content-type': 'multipart/form-data',
      },
      success: function (res) {
        successUp++ //成功+1
        var dataList = JSON.parse(res.data)
        if (dataList.status == 1) {
          that.setData({
            faceUrl: dataList.data,
            faceUrl1: mediaURL + dataList.data,
          })
        }
      },
      fail: function (e) {
        failUp++ //失败+1
      },
      complete: function (e) {
        count++ //下一张
        if (count == length) {
          //上传完毕，作一下提示
          console.log('上传成功' + successUp + ',' + '失败' + failUp)
        } else {
          //递归调用，上传下一张
          that.uploadOneByOne(imgPaths, successUp, failUp, count, length)
          console.log('正在上传第' + count + '张')
        }
      },
    })
  },
  // 保存信息
  formSubmit: function (e) {
    var errorMessage = null
    if (this.data.date == '请选择日期') {
      errorMessage = '请选择生日'
    }
    if (util.isEmpty(this.data.currLevelNum)) {
      errorMessage = '请填写级位号'
    }
    if (this.data.currLevelNum.length > 64) {
      errorMessage = '级位号超过规定长度, 请确认'
    }

    if (errorMessage) {
      wx.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 2000,
      })
      return false
    }

    const { pickerId2, pickerId3, pickerId4 } = this.data
    let id = this.data.id
    let obj = e.detail.value
    obj.id = id
    obj.address = this.data.address
    obj.coachId = this.data.coachId
    obj.currLevelId = this.data.currLevelId
    obj.examCode = this.data.examCode
    obj.gender = this.data.gender
    obj.faceUrl = this.data.faceUrl
    obj.levels = [pickerId2, pickerId3, pickerId4]
      .filter((id) => id > 0)
      .join(',')
    obj.relationship = this.data.pickerIndex
    obj.birthday = this.data.date
    obj.coachClassId = this.data.coachClasses[this.data.coachClassIndex].id
    obj.currLevelNum = this.data.currLevelNum

    wx.getStorage({
      key: 'token',
      success(res) {
        var token = res.data
        wx.request({
          url: baseURL + '/sign/sign',
          header: {
            authorization: 'Bearer ' + token,
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'post',
          data: obj,
          success: function (res) {
            if (res.data.status == '403') {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
              wx.clearStorage()
              wx.navigateTo({
                url: '../sign/sign',
              })
              return false
            }
            const data = res.data
            if (data.status == 1) {
              if (e.detail.target.dataset.type == 'conform') {
                wx.navigateTo({
                  url: '../../pages/sign/sign',
                })
              } else {
                wx.navigateTo({
                  url: '../../pages/pay/pay?id=' + data.data.signId,
                })
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          },
        })
      },
    })
  },
  pay: function (e) {
    let obj = e.detail.value
    obj.address = this.data.address
    obj.coachId = this.data.coachId
    obj.currLevelId = this.data.currLevelId
    obj.examCode = this.data.examCode
    obj.gender = this.data.gender
    obj.faceUrl = this.data.faceUrl
    obj.levels = this.data.levels
    obj.relationship = this.data.pickerIndex
    wx.getStorage({
      key: 'token',
      success(res) {
        var token = res.data
        wx.request({
          url: baseURL + '/sign/sign',
          header: {
            authorization: 'Bearer ' + token,
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: 'post',
          data: obj,
          success: function (res) {
            const data = res.data
            if (data.status == 1) {
              wx.navigateTo({
                url: '../../pages/pay/pay?id=' + data.signId,
              })
            } else {
            }
          },
        })
      },
    })
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
})
