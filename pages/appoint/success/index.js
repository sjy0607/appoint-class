// pages/appoint/success/index.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    customerId:'',
    imgUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      if(!arr[1])return;
      _this.getCodeScan(arr[1],arr[0],_this)
    });
  },
  refresh(){
    this.getCodeScan();
  },
  toPurchase(){
    wx.switchTab({
      url: '/pages/tabBar/index/index',
    })
  },
  getCodeScan(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId], code);
    util.Req(app.globalData.url+app.globalData.config + '/iot/qrCode', 'get', {customerId: customerId,digest:encrypt}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      _this.setData({
        imgUrl:res.data,
      })
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