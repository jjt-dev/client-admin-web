import { buildRequest, formatDate } from "../../utils/util";

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
          if (data.data && data.data.length > 0) {
            signEntity.setData({
              signedStudents: [{ id: -1, name: "在下面手动输入" }].concat(
                data.data
              ),
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

const updateSignStudentInfo = (signEntity, studentIndex) => {
  const student = signEntity.data.signedStudents[studentIndex];
  signEntity.setData({
    studentIndex,
    name: studentIndex > 0 ? student.name : "",
    cardId: studentIndex > 0 ? student.cardId : "",
    gender: studentIndex > 0 ? student.gender : 0,
    date: studentIndex > 0 ? formatDate(student.birthday) : "请选择日期",
    phone: studentIndex > 0 ? student.phone : "",
  });
};

module.exports = {
  getSignedStudents,
  updateSignStudentInfo,
};
