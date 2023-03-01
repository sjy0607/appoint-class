// pages/member/index.js
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList:[],
    levelName:'',
    nextLevelName:'',
    growthValue:'',
    nextLevelPercent:'',
    username:'',
    avatarUrl:'',
    rules:[{
      name:'预约教室',
      id:1,
      url:'/images/member/menber_rule_icon_order@3x.png'
    },{
      name:'预约老师',
      id:2,
      url:'/images/member/menber_rule_icon_teacher@3x.png'
    },{
      name:'购买次卡',
      id:3,
      url:'/images/member/home_icon_card@3x.png'
    }]
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
  getUserProfile(event){
    const id=event.currentTarget.dataset.id
    // console.log(event.currentTarget.dataset,'rrr')
    var _that=this
    if (!wx.getStorageSync('storage_info')) {
      console.log('wwww')
      util.getUserProfile().then(function(arr){
        _that.setData({
            code: arr[0],
            customerId: arr[1]
        });
        _that.getmemberInfo(arr[1], arr[0], _that);
      });
    }
    else{
      console.log(id,'ttt')
      if(id==2){
        wx.switchTab({
          url: '/pages/tabBar/appointeacher/index',
        })
      }else if(id==1){
        wx.navigateTo({
          url: '/pages/dancelist/index',
   
        })
      }else{
        wx.navigateTo({
          url: '/pages/allCards/index',
        })
      }
    }
  },
  getmemberInfo(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId], code);
    util.Req(app.globalData.url+app.globalData.config + '/member/info', 'get', { customerId: customerId, digest: encrypt }, {
      'content-type': 'application/json'
    }, _this, function (res) {
      
      _this.setData({
        activityList:res.data.memberActivityList,
        avatarUrl:res.data.userInfo.avatarImgUrl,
        username:res.data.userInfo.name,
        levelName:res.data.userInfo.levelName,
        nextLevelName:res.data.userInfo.nextLevelName,
        growthValue:res.data.userInfo.growthValue,
        nextLevelPercent:res.data.userInfo.nextLevelPercent
      })
      // console.log(this.data,'fff')
    }, function () { })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this=this
    // wx.login({
    //   success: function (data) {
    //     code = data.code;
    //     wx.setStorageSync('code', code);
    //   }
    // })
    util.CodeId().then(function (arr) {
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      if(!arr[1])return;
      _this.getmemberInfo(arr[1], arr[0], _this);
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