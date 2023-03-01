// pages/cardetail/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:0,
    id:'',
    code:'',
    customerId:'',
    discountPrice:0,
    price:0,
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'hhhh')
    this.setData({
      type:options.type,
      id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this=this;
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this=this;
    wx.request({  // 获取ip
      url: 'http://ip-api.com/json',
      success: function (e) {
        console.log(e.data,'ppp')
        _this.setData({
          ip: e.data.query
        })
      }
    })
    util.CodeId().then(function (arr) {
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      _this.getCardsInfo(arr[1],arr[0],_this)
    });
  },
  getCardsInfo(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.id,1], code);
    util.Req(app.globalData.url+app.globalData.config + '/order/pre/info', 'get', {customerId: customerId,digest:encrypt,memberCardId:_this.data.id,type:1}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      _this.setData({
        info:res.data.memberCardResp,
        discountPrice:res.data.discountPrice,
        price:res.data.price
      })
    }, function () { })
  },
  pay(){
    var _this=this;
    console.log(_this.data.ip,'oooo')
    var encrypt = util.HMAC_sort([_this.data.customerId,_this.data.id,1,_this.data.ip], _this.data.code);
    util.Req(app.globalData.url+app.globalData.config + '/order/create', 'post', 
    {customerId: _this.data.customerId,digest:encrypt,memberCardId:_this.data.id,goodsType:1,ip:_this.data.ip}, {
      'content-type': 'application/json'
    }, _this, function (res) {
        const appId=res.data.appId;
        const nonceStr=res.data.nonceStr;
        const packageValue=res.data.packageValue;
        const paySign	=res.data.paySign;
        const timeStamp=res.data.timeStamp;
        const signType=res.data.signType;
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: packageValue,
          signType: signType,
          paySign: paySign,
          success (res) {
            console.log(res,'rrrr')
            wx.navigateTo({
              url: '/pages/room/index',
            })
           },
          fail (res) { }
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