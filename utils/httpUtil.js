const config = require("../lib/js/config");
const { baseURL } = config.config();

const buildRequest = (url, token, method = "get") => {
  return {
    url: baseURL + url,
    header: {
      authorization: "Bearer " + token,
      "content-type": "application/x-www-form-urlencoded",
    },
    method,
  };
};

const getSignedStudents = (examCode, signEntity) => {
  wx.getStorage({
    key: "token",
    success(res) {
      var token = res.data;
      wx.request({
        ...buildRequest("/sign/getMySignStudentList", token),
        data: {
          examCode: examCode,
        },
        success: function ({ data }) {
          if (data.status == "403") {
            common.goToLogin(data.msg);
            return false;
          }
          if (data.data && data.data.length > 0) {
            signEntity.setData({
              signedStudents: [{ id: -1, name: "请选择" }].concat(data.data),
            });
          }
        },
        fail: function () {
          console.log("获取已报名考生列表失败");
        },
      });
    },
  });
};

module.exports = {
  getSignedStudents,
};
