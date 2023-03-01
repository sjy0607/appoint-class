// pages/appoint/unstart/index.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    customerId:'',
    info:{},
    orderId:'',
    lastTime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.order_id){
      this.setData({
        orderId:options.order_id
      })
    }      
  },
  countTime() {  
    //获取当前时间  
    var date = new Date();  
    var now = date.getTime();  
    //设置截止时间  
    var end=this.data.info.startTime;
    // var end = endDate.getTime();  
    
    //时间差  
    console.log(now,'tttt',end)
    var leftTime = end-now; 
    console.log(leftTime,'ppp')
    //定义变量 d,h,m,s保存倒计时的时间  
    var d,h,m,s;  
    if (leftTime>=0) {  
        d = Math.floor(leftTime/1000/60/60/24);  
        h = Math.floor(leftTime/1000/60/60%24);  
        m = Math.floor(leftTime/1000/60%60);  
        s = Math.floor(leftTime/1000%60);                     
    } else{
      d = '00';  
      h = Math.floor(-leftTime/1000/60/60%24);  
      m = Math.floor(-leftTime/1000/60%60);  
      s = Math.floor(-leftTime/1000%60);    
    }
    //将倒计时赋值到div中  
    this.setData({
      lastTime:d+'天'+h+'时'+m+'分'+s+'秒'
    })
    //递归每秒调用countTime方法，显示动态时间效果  
    setTimeout(this.countTime,1000);  

  }, 
  openDoor(){
    wx.switchTab({
      url: '/pages/appoint/success/index',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this=this;
    util.CodeId().then(function (arr) {
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      _this.getPayDetail(arr[1],arr[0],_this)
    });
  },
  getPayDetail(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.orderId], code);
    util.Req(app.globalData.url+app.globalData.config + '/order/detail', 'get', {customerId: customerId,digest:encrypt,orderId:_this.data.orderId}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      _this.setData({
        info:res.data,
      })
      _this.countTime()
    }, function () { })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})