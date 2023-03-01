// pages/room/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customerId:'',
    code:'',
    rooms:[
    ],
    list:[],
    tabs:[
     
      {
        level:'大教室',
        type:2
      },
      {
        level:'中教室',
        type:1
      },
      {
        level:'小教室',
        type:0
      }
    ],
    type:2
  },
  getCardsList(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId], code);
    util.Req(app.globalData.url+app.globalData.config + '/member-card/mine/list', 'get', {customerId: customerId,digest:encrypt}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      res.data.items.forEach(i=>{
        i.expiresTime=i.expiresTime;
      })
      _this.setData({
        rooms:res.data.items
      })
      const list=_this.data.rooms.filter(i=>{
        return i.type==_this.data.type
      })
      _this.setData({
        list:list
      })
      console.log(_this.data.list,'www')
    }, function () { })
  },
  toggleRoom(e){
    console.log(e,'kkkk')
    const type = e.currentTarget.dataset.type;
    const list=this.data.rooms.filter(i=>{
      return i.type==type
    })
    this.setData({
      type: type,
    });
    this.setData({
      list:list
    })
    console.log(this.data.list,'kk')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type,'ee')
    var _this=this;
    _this.setData({
      type:options.type
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
      _this.getCardsList(arr[1],arr[0],_this)
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