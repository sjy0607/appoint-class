// pages/teacherResign/index.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    notes:'',
    name:'',
    customerId:'',
    code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getNameValue(e){
    this.setData({
      name:e.detail.value
    })
  },
  getPhoneNumber(e){
    this.setData({
      phone:e.detail.value
    })
  },
  getIntroduction(e){
    this.setData({
      notes:e.detail.value
    })
  },
  submit(){
    var _this=this;
    var encrypt = util.HMAC_sort([_this.data.customerId,_this.data.name,_this.data.phone,_this.data.notes], _this.data.code);
    const req  ={
      description:_this.data.notes,
      phone:_this.data.phone,
      name:_this.data.name,
      digest:encrypt,
      customerId:_this.data.customerId
    }
    util.Req(app.globalData.url+app.globalData.config + '/teacher/check-in', 'post',JSON.stringify(req), {
      'content-type': 'application/json'
    }, _this, function (res) {
      wx.showToast({
        title: '提交成功',
      })
      wx.navigateBack({
        delta: 1,
      })
    }, function () { })
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
    });
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