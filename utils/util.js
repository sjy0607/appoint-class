// 引用HMAC加密
var Crypto = require('cryptojs/cryptojs.js');
var id='';
const formatTime = date => {
  var date=new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatDate = date => {
  var date=new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//正式库
var config = "https://infinitedance.net";

/***公共获取customerId方法*/
function Allogin(){
  return new Promise((resolve, reject) => {
    var code = "", signature = "", rawData = "", encryptedData = "", iv = "",customerId="";
    var _this=this;
    // wx.getSetting({
    //   success(res) {
    //     console.log(res.authSetting,'返回信息')
    //     if (res.authSetting['scope.userInfo']) {
          // wx.login({
          //   success: function (data) {
          //     code = data.code;
          //     if (code) {
                wx.getUserProfile({
                  desc: '用于完善个人资料',
                  success: function (res) {
                    console.log(res,'登录后信息')
                    signature = res.signature;
                    rawData = res.rawData;
                    encryptedData = res.encryptedData;
                    wx.setStorageSync('storage_info', 1);
                    code=wx.getStorageSync('code');
                    iv = res.iv;
                    wx.request({
                      url: config+'/api/wechat/api/login',
                      method: 'post',
                      data: { code: code, signature: signature, rawData: rawData, encryptedData: encryptedData, iv: iv },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded',
                      },
                      success: function (data) {
                        console.log(data,'ggg')
                        if (data.data.code == '0') {
                          customerId = data.data.data;
                          console.log(customerId+'vvvvvvvvvv');
                          wx.setStorageSync('code', code);
                          wx.setStorageSync('customerId', customerId);
                          resolve([code,customerId]);
                        }else if(data.data.code=='0000'){
                          wx.showModal({
                            title: '提示',
                            content: '系统出错，稍后重试'
                          })
                        }
                      }
                    })
                  },
                  fail: function (res) {
                    console.log(res,'gggg')
                    wx.showModal({
                      title: '用户未授权',
                      content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
                      showCancel: false,
                      success: function (resbtn) {
                        console.log(resbtn)
                      }
                    })
                  }
                })
          //     }
          //   }
          // })
        // }else{
        //   wx.showModal({
        //     title: '提示',
        //     content: '您还没有授权哦',
        //     success: function (res) {
        //       if (res.confirm) {
        //         console.log('用户点击确定')
        //       } else if (res.cancel) {
        //         console.log('用户点击取消')
        //       }
        //     }
        //   })
        // }
      // }
    // })
  })
}
function getUserProfile(){
  // if (!wx.getStorageSync('storage_info')) {
    return new Promise((resolve, reject) => {
      Allogin().then(function ([code, customerId]) {
        console.log('abcdef');
        resolve ([code, customerId])
      })
    })
      
    // wx.getUserProfile({
    //   success: function (res) {
    //     console.log(res,'登录后信息')
    //     signature = res.signature;
    //     rawData = res.rawData;
    //     encryptedData = res.encryptedData;
    //     iv = res.iv;
    //     wx.setStorageSync('storage_info', 1);
    //     wx.request({
    //       url: config+'/api/wechat/api/login',
    //       method: 'post',
    //       data: { code: code, signature: signature, rawData: rawData, encryptedData: encryptedData, iv: iv },
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded',
    //       },
    //       success: function (data) {
    //         console.log(data,'ggg')
    //         if (data.data.code == '0') {
    //           customerId = data.data.data;
    //           console.log(customerId+'vvvvvvvvvv');
    //           wx.setStorageSync('code', code);
    //           wx.setStorageSync('customerId', customerId);
    //           resolve([code,customerId]);
    //         }else if(data.data.code=='0000'){
    //           wx.showModal({
    //             title: '提示',
    //             content: '系统出错，稍后重试'
    //           })
    //         }
    //       }
    //     })
    //   },
    //   fail: function (res) {
    //     wx.showModal({
    //       title: '用户未授权',
    //       content: '如需正常使用该小程序功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',
    //       showCancel: false,
    //       success: function (resbtn) {
    //         console.log(resbtn)
    //       }
    //     })
    //   }
    // })
  // }else{

  // }
}
function CodeId(){
  console.log(id+'值')
  return new Promise((resolve,reject)=>{
    if (wx.getStorageSync('code') && wx.getStorageSync('customerId')) {
      console.log('5555')
      var code = wx.getStorageSync('code'), customerId = wx.getStorageSync('customerId');
      resolve ([code, customerId]);
    } else {
      wx.login({
        success: function (data) {
          console.log(data,'iii')
          code = data.code;
          wx.setStorageSync('code', code);
          resolve ([code,'']);
        }
      })
      // Allogin().then(function ([code, customerId]) {
      //   console.log('abcdef');
      //   resolve ([code, customerId])
      // })
    }
  })

}
// 加密并且排序
function HMAC_sort(arr,code){
  var str=arr.sort().join("");
  return Crypto.Crypto.HMAC(Crypto.Crypto.SHA256, str, code);
}
//公共request
function Req(url, mtype, data, header, _this, cb,cb_three,options){
  wx.request({
    url: url,
    data: data,
    header: header,
    method: mtype,
    success: function(res) {
      console.log(res.data.code+'报错码');
      if (res.data.code == 0) {
        return typeof cb == "function" && cb(res.data)
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.message,
          showCancel:false,
          confirmText:'确定',
          success: function (res) {
            console.log(res,'xxxx')
            console.log(res.confirm+'xxxx');
            if (res.confirm) {
              console.log('aaaaaaaaaa');
              // Allogin().then(function (arr) {
              //   console.log('aaaaaaaaaa');
              //   _this.setData({
              //     code: arr[0],
              //     customerId: arr[1]
              //   });
                //刷新页面
                // _this.onShow();
                //  _this.onLoad(options);
              // })
            }
          }
        })
      } 
    },
    fail: function(res) {
      console.log(res);
    },
    complete: function (res) {
      if (res.statusCode=='502'){
        wx.showModal({
          title: '提示',
          content: '系统正在重启中，请稍候...'
        })
      }
    },
  })
}
module.exports = {
  formatTime: formatTime,
  formatDate:formatDate,
  Allogin: Allogin,
  HMAC_sort: HMAC_sort,
  CodeId:CodeId,
  Req:Req,
  getUserProfile:getUserProfile
}
