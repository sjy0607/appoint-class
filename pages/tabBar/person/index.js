// pages/person/index.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packets:[],
    times:0,
    username:'',
    code:'',
    index:0,//3为全部
    customerId:'',
    levelName:'',
    nextLevelName:'',
    growthValue:'',
    nextLevelPercent:'',
    hours:0,
    avatarUrl:'',
    cardList:[],
    unusecount:0,
    doingcount:0,
    samllHour:25,
    userlogin:false,
    middleHour:25,
    userInfo:'',
    maxHour:25
  },
  getUserProfile(event){
    const type = event.currentTarget.dataset.type;
    const index=event.currentTarget.dataset.index;
    console.log(event.currentTarget.dataset.type,'tt')
    var _that=this
    if (!wx.getStorageSync('storage_info')) {
      util.getUserProfile().then(function(arr){
        _that.setData({
            code: arr[0],
            customerId: arr[1]
        });
        _that.getInfo(arr[1], arr[0], _that);
      });
    }
    else{
      if(index){
        wx.navigateTo({
          url: '/pages/myorder/index?order_type='+index,
        })
      }else{
        wx.navigateTo({
          url: '/pages/room/index?type='+type,
        })
      }
      
    }
    // wx.getUserProfile({
    //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     util.CodeId().then(function (arr) {
    //       _that.setData({
    //         code: arr[0],
    //         customerId: arr[1]
    //       });
    //       _that.getInfo(arr[1], arr[0], _that);
    //     });
    //   }
    // })
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
    var _this=this
    util.CodeId().then(function (arr) {
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      if(!arr[1])return;
      _this.getInfo(arr[1], arr[0], _this);
    });
  },
  getInfo(customerId,code,_this){
    wx.hideLoading();
    var encrypt = util.HMAC_sort([customerId], code);
    util.Req(app.globalData.url+app.globalData.config + '/personal-center/info', 'get', { customerId: customerId, digest: encrypt }, {
      'content-type': 'application/json'
    }, _this, function (res) {
     
      _this.setData({
        times:res.data.times,
        hours:res.data.hours,
        unusecount:res.data.unusedOrderNum,
        doingcount:res.data.undoneOrderNum,
        cardList:res.data.cardList,
        avatarUrl:res.data.userInfo.avatarImgUrl,
        username:res.data.userInfo.name,
        levelName:res.data.userInfo.levelName,
        nextLevelName:res.data.userInfo.nextLevelName,
        growthValue:res.data.userInfo.growthValue,
        nextLevelPercent:res.data.userInfo.nextLevelPercent
      })
      // _this.setData({
      //   latestMsg:res.data.newsList
      // })
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