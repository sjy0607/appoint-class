// pages/dancedetail/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    autoplay:true,
    customerId:'',
    currentIndex:0,
    switch2Checked:false,
    code:'',
    id:'',
    // homeBanner:[{
    //   url:'/images/home_roll_img.png'
    // },
    // {
    //   url:'/images/home_roll_img.png'
    // },
    // {
    //   url:'/images/home_roll_img.png'
    // }
     
    // ],
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  appointRom(){
    wx.navigateTo({
      url: '/pages/roomlist/index?id='+this.data.id,
    })
  },
  switchChange(e){
    var index= e.currentTarget.dataset.index;
    this.setData({
      currentIndex:index
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
      _this.getDanceDetail(arr[1],arr[0],_this)
    });
  },
  makeCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.info.phone
    })
  },
  toMap(){
    wx.navigateTo({
      url: '/pages/map/index?latitude='+this.data.info.latitude+'&longitude='+this.data.info.longitude+'&address='+this.data.info.address,
    })
  },
  getDanceDetail(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.id], code);
    util.Req(app.globalData.url+app.globalData.config + '/studio/detail', 'get', {customerId: customerId,digest:encrypt,id:_this.data.id}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      _this.setData({
        info:res.data
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