// pages/appoint/index.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId:'',
    code:'',
    offsetId:0,
    teachers:[],
    isBottom:false,
  },
  toAppointTeacher(){
    wx.navigateTo({
      url: '/pages/teacherResign/index',
    })
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
      _this.getTeacherList(arr[1],arr[0], _this);
    });
  },
  getUserProfile(){
    var _that=this
    // if (!wx.getStorageSync('storage_info')) {
    //   console.log('wwww')
    //   util.getUserProfile().then(function(arr){
    //     _that.setData({
    //         code: arr[0],
    //         customerId: arr[1]
    //     });
    //     _that.getmemberInfo(arr[1], arr[0], _that);
    //   });
    // }
    // else{
      // console.log()
      wx.navigateTo({
        url: '/pages/teacherdetail/index?teacherId='+_that.data.offsetId,
      })
    // }
  },
  toAppoint(e){
    console.log(e,'eee')
    const teacherId=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/teacherdetail/index?teacherId='+teacherId,
    })
  },
  getTeacherList(customerId,code,_this){
    var offsetId=_this.data.offsetId;
    var encrypt = util.HMAC_sort([customerId,offsetId], code);
    util.Req(app.globalData.url+app.globalData.config + '/teacher/list', 'get', {offsetId:offsetId,digest:encrypt,customerId:customerId}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      if(!res.data.items.length){
        _this.setData({
          isBottom:true
        })
        return;
      }
      _this.setData({
        teachers:_this.data.teachers.concat(res.data.items),
      })
      
      _this.data.offsetId=_this.data.teachers[_this.data.teachers.length-1].teacherId;
      // console.log(this.data,'fff')
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
    // wx.showLoading({ title: '加载中', icon: 'loading', duration: 10000 });
    this.getTeacherList(this.data.customerId,this.data.code,this)
    

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})