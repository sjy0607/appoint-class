// pages/dancelist/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    customerId:'',
    isBottom:false,
    offsetId:0,
    dancelist:[
      // {
      //   url:'/images/rooms/dance_img_one@3x.png',
      //   name:'深圳市福田区',
      //   address:'深圳市福田区海松大厦B座222（从大夏边界的阶梯进入二...'
      // },
      // {
      //   url:'/images/rooms/dancepar_img@3x.png',
      //   name:'深圳市福田区',
      //   address:'深圳市福田区海松大厦B座222（从大夏边界的阶梯进入二...'
      // }
      
    ]
  },
  toDanceDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/dancedetail/index?id='+id,
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
      _this.getDetailRoomList(arr[1],arr[0],_this)
    });
  },
  getDetailRoomList(customerId,code,_this){
    var offsetId=_this.data.offsetId;
    var encrypt = util.HMAC_sort([customerId,offsetId], code);
    util.Req(app.globalData.url+app.globalData.config + '/studio/list', 'get', {customerId: customerId,digest:encrypt,offsetId:offsetId}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      if(!res.data.items.length){
        _this.setData({
          isBottom:true
        })
        return;
      }
      _this.setData({
        dancelist:_this.data.dancelist.concat(res.data.items)
      })
      _this.data.offsetId=_this.data.dancelist[_this.data.dancelist.length-1].id;
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