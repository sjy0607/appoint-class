// pages/submit/message/index.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times:'',
    number:'',
    phoneNumber:'',
    avatar:'',
    customerId:'',
    code:'',
    content:'',
    name:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'rr')
    var _this=this;
    _this.setData({
      times:options.reserveTimes,
      avatar:options.teacherAvatar,
      name:options.teacherName,
      id:options.teacherId
    })
  },
  submit(){
    var _this=this;
    _this.goSubmit(_this.data.customerId,_this.data.code, _this);
  },
  getNumberValue(e){
    this.setData({
      number:e.detail.value
    })
  },
  getPhoneValue(e){
    this.setData({
      phoneNumber:e.detail.value
    })
  },
  getNotesValue(e){
    this.setData({
      content:e.detail.value
    })
  },
  goSubmit(customerId,code,_this){
    console.log(_this.data.content,'hh')
    var encrypt = util.HMAC_sort([customerId,_this.data.content,_this.data.phoneNumber,_this.data.number,_this.data.id], code);
    const teacherReserveReq ={
      notes:_this.data.content,
      phone:_this.data.phoneNumber,
      num:_this.data.number,
      id:_this.data.id,
      digest:encrypt,
      customerId:customerId
    }
    util.Req(app.globalData.url+app.globalData.config + '/teacher/reserve', 'post',JSON.stringify(teacherReserveReq), {
      'content-type': 'application/json'
    }, _this, function (res) {
      wx.showToast({
        title: '提交成功',
      })
      wx.navigateTo({
        url:'/pages/submit/success'
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