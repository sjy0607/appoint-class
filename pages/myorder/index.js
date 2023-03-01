// pages/myorder/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    customerId:'',
    ordertab:
    [
      {
        level:'全部',
        type:0
      },
      {
        level:'未使用',
        type:1
      },
      {
        level:'进行中',
        type:2
      },
      {
        level:'已完成',
        type:3
      }
    ],
    orders:[
    //   {
    //   number:'订单编号:99999999999999999',
    //   name:'C教室（中）',
    //   date:'2021-08-15',
    //   time:'22:50~00:00',
    //   address:'上海市普陀区长寿路401号3'
    // }
  ],
    type:0,
    list:[]
  },
  toggleTab(e){
    console.log(e,'kkkk')
    this.setData({
      type:e.currentTarget.dataset.type
    })
    // const type = e.currentTarget.dataset.type;
    this.getOrderList(this.data.customerId,this.data.code,this)
    // const list=this.data.orders.filter(i=>{
    //   return i.type==type
    // })
    // this.setData({
    //   type: type,
    // });
    // this.setData({
    //   list:list
    // })
    console.log(this.data.list,'kk')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.order_type,'oo')
    if(options.order_type){
      this.setData({
        type:options.order_type
      })
    }
    
  },
  seeMap(e){
    const address=e.currentTarget.dataset.address;
    const latitude=e.currentTarget.dataset.latitude;
    const longitude=e.currentTarget.dataset.longitude;
    wx.navigateTo({
      url: '/pages/map/index?address='+address+'&latitude='+latitude+'&longitude='+longitude,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  cancelOrder(e){
    var _this=this;
    const order_id=e.currentTarget.dataset.id;
    var encrypt = util.HMAC_sort([_this.data.customerId,order_id], _this.data.code);
    wx.showModal({
      title: '提示',
      content: '确定要取消订单',
      success (res) {
        if (res.confirm) {
          util.Req(app.globalData.url+app.globalData.config + '/order/cancel', 'get', 
          {customerId: _this.data.customerId,digest:encrypt,orderId:order_id}, {
            'content-type': 'application/json'
          }, _this, function (res) {
            _this.getOrderList(_this.data.customerId,_this.data.code,_this)
          }, function () { })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })           
   
  },
  deleteOrder(e){
    var _this=this;
    const order_id=e.currentTarget.dataset.id;
    var encrypt = util.HMAC_sort([_this.data.customerId,order_id], _this.data.code);
    wx.showModal({
      title: '提示',
      content: '确定要删除订单',
      success (res) {
        if (res.confirm) {
          util.Req(app.globalData.url+app.globalData.config + '/order/delete', 'get', 
          {customerId: _this.data.customerId,digest:encrypt,orderId:order_id}, {
            'content-type': 'application/json'
          }, _this, function (res) {
            _this.getOrderList(_this.data.customerId,_this.data.code,_this)
          }, function () { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })           
   
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
      _this.getOrderList(arr[1],arr[0],_this)
    });
  },
  toUse(e){
    const order_id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/appoint/unstart/index?order_id='+order_id,
    })
  },
  toScan(e){
    const order_id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/appoint/unstart/index?order_id='+order_id,
    })
  },
  getOrderList(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.type], code);
    util.Req(app.globalData.url+app.globalData.config + '/order/list', 'get', {customerId: customerId,digest:encrypt,type:_this.data.type}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      // res.data.items.forEach(i=>{
      //   i.expiresTime=util.formatTime(i.expiresTime);
      // })
      _this.setData({
        orders:res.data.items
      })
      // const list=_this.data.orders.filter(i=>{
      //   return i.type==_this.data.type
      // })
      // _this.setData({
      //   list:list
      // })
      console.log(_this.data.list,'www')
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