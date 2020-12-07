const config = require("../lib/js/config");
const { baseURL } = config.config();

const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

const isEmpty = (str) => {
  return !str || str.trim() === "";
};

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

const formatDate = (number, format = "YYYY-MM-DD") => {
  var formateArr = ["YYYY", "MM", "DD"];
  var returnArr = [];

  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format.replace(/\//g, "-");
};

const getHeader = (token) => {
  return {
    authorization: "Bearer " + token,
    "content-type": "application/x-www-form-urlencoded",
  };
};

module.exports = {
  formatTime,
  isEmpty,
  buildRequest,
  formatDate,
  getHeader,
};
