function getMyDate(str) {
  var oDate = new Date(str),
    oYear = oDate.getFullYear().toString().substring(2, 4),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime =
      oYear +
      "/" +
      getzf(oMonth) +
      "/" +
      getzf(oDay) +
      " " +
      getzf(oHour) +
      ":" +
      getzf(oMin), //最后拼接时间
    oTime1 = oYear + "/" + getzf(oMonth) + "/" + getzf(oDay);
  return oTime;
}

function getMyDate1(str, type) {
  var oDate = new Date(str),
    oYear = oDate.getFullYear().toString(),
    oMonth = oDate.getMonth() + 1,
    oDay = oDate.getDate(),
    oHour = oDate.getHours(),
    oMin = oDate.getMinutes(),
    oSen = oDate.getSeconds(),
    oTime =
      oYear +
      "/" +
      getzf(oMonth) +
      "/" +
      getzf(oDay) +
      " " +
      getzf(oHour) +
      ":" +
      getzf(oMin), //最后拼接时间
    oTime1 = oYear + getzf(oMonth) + getzf(oDay);
  var oTime2 = oYear + "-" + getzf(oMonth) + "-" + getzf(oDay);
  if (type) {
    return oTime2;
  } else {
    return oTime1;
  }
}

//补0操作
function getzf(num) {
  if (parseInt(num) < 10) {
    num = "0" + num;
  }
  return num;
}

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }
  let _lastTime = null;
  return function () {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      // 将this和参数传给原函数
      fn.apply(this, arguments);
      _lastTime = _nowTime;
    }
  };
}

function goToLogin(msg) {
  wx.showToast({
    title: msg,
    icon: "none",
    duration: 2000,
  });
  wx.getStorage({
    key: "examCode",
    success(res) {
      wx.clearStorage();
      wx.navigateTo({
        url: "/pages/sign/sign?examCode=" + res.data,
      });
    },
    fail() {
      wx.clearStorage();
      wx.navigateTo({
        url: "/pages/sign/sign",
      });
    },
  });
}

function getExamCodeFromUrl(url) {
  return decodeURIComponent(url).split("=")[1];
}

module.exports = {
  getMyDate: getMyDate,
  getMyDate1: getMyDate1,
  throttle: throttle,
  goToLogin: goToLogin,
  getExamCodeFromUrl: getExamCodeFromUrl,
};
