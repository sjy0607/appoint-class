// pages/roomdetail/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    autoplay:true,
    currentIndex:0,
    info:{},
    id:'',
    introduct:[
      '1、24小时营业、智能开关、免费饮水',
      '2、手机以及照相机拍摄三脚架',
      '3、JBL蓝牙音响名字:JBLPARTYBOX ON-THE-GC',
      '4、充电宝租借',
      '5、舞蹈房入场人数建议:15-20人',
      '6、提供投影仪(使用说明在上方图片或下拉查看)'
    ],
    // homeBanner:[{
    //   url:'/images/home_roll_img.png'
    // },
    // {
    //   url:'/images/home_roll_img.png'
    // },
    // {
    //   url:'/images/home_roll_img.png'
    // }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
  },
  switchChange(e){
    var index= e.currentTarget.dataset.index;
    this.setData({
      currentIndex:index
    })
  },
  toBuy(){
    wx.navigateTo({
      url: '/pages/allCards/index?type='+this.data.info.type+'&isDisable=1',
    })
  },
  toCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.info.phone
    })
  },
  toMap(){
    wx.navigateTo({
      url: '/pages/map/index?latitude='+this.data.info.latitude+'&longitude='+this.data.info.longitude+'&address='+this.data.info.address,
    })
  },
  toAppoint(){
    wx.navigateTo({
      url: '/pages/startappoint/index?id='+this.data.id+'&title='+this.data.info.title+'&address='+this.data.info.address,
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
      _this.getRoomDetail(arr[1],arr[0],_this)
    });
  },
  getRoomDetail(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.id], code);
    util.Req(app.globalData.url+app.globalData.config + '/classroom/detail', 'get', {customerId: customerId,digest:encrypt,id:_this.data.id}, {
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