// pages/teacherdetail/index.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherId:'',
    customerId:'',
    indicatorDots:true,
    autoplay:true,
    currentIndex:0,
    info:{},
    code:''
  },
  switchChange(e){
    var index= e.currentTarget.dataset.index;
    this.setData({
      currentIndex:index
    })
  },
  getUserProfile(){
    var _that=this
     if (!wx.getStorageSync('storage_info')) {
      console.log('wwww')
      util.getUserProfile().then(function(arr){
        _that.setData({
            code: arr[0],
            customerId: arr[1]
        });
        wx.navigateTo({
          url: '/pages/submit/message/index?teacherAvatar='+_that.data.info.avatarImgUrl+'&teacherName='+_that.data.info.name+'&reserveTimes='+_that.data.info.reservationTimes
          +'&teacherId='+
          _that.data.info.teacherId,
        })
      });
    }
    else{
      wx.navigateTo({
        url: '/pages/submit/message/index?teacherAvatar='+_that.data.info.avatarImgUrl+'&teacherName='+_that.data.info.name+'&reserveTimes='+_that.data.info.reservationTimes+'&teacherId='+
        _that.data.info.teacherId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      teacherId:options.teacherId
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
    var _this=this
    util.CodeId().then(function (arr) {
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      _this.getTeacherDetail(arr[1], arr[0], _this);
    });
  },
  getTeacherDetail(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.teacherId], code);
    util.Req(app.globalData.url+app.globalData.config + '/teacher/detail', 'get', { customerId: customerId, digest: encrypt,id :_this.data.teacherId}, {
      'content-type': 'application/json'
    }, _this, function (res) {
  
      _this.setData({
        info:res.data
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})