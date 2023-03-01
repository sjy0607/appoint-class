// index.js
// 获取应用实例
const app = getApp()
var util = require('../../../utils/util.js');
Page({
  data: {
    indicatorDots:true,
    autoplay:true,
    code:'',
    customerId:'',
    homeBanner:[
    //   {
    //   url:'/images/home_roll_img.png'
    // },
    // {
    //   url:'/images/home_roll_img.png'
    // },
    // {
    //   url:'/images/home_roll_img.png'
    // }
     
    ],
    cardList:[{
      name:'IFD练习室',
      id:1,
      url:'/images/home_logo@2x.png',
      note:'InFinite Dance'
    },{
      name:'立刻预约',
      id:2,
      url:'/images/home_icon_order@2x.png',
      note:'Check Schedule'
    }],
    latestMsg:[
      {
        name:'快来预约哇！',
        url:'/images/home_advisory_img@3x.png'
      }
    ]
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // canIUseGetUserProfile: false,
    // canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  purchase(e){
    var _this = this;
    if (e.detail.userInfo) {
      util.CodeId().then(function (arr) {
        _this.setData({
          code: arr[0],
          customerId: arr[1]
        });
      });
    } else {
      wx.showModal({
        title: '提示',
        content: "只有授权后才能享受更多服务哦"
      })
    }
  },
  appointRoom(e){
    const id=e.currentTarget.dataset.id
    if(id==2){
      if (!wx.getStorageSync('storage_info')) {
        util.getUserProfile().then(function(arr){
          _that.setData({
              code: arr[0],
              customerId: arr[1]
          });
          _that.getIndexInfo(arr[1], arr[0], _that);
        });
      }else{
        wx.navigateTo({
          url: '/pages/dancelist/index',
        })
      }
      
    }
    
  },
  getIndexInfo(customerId,code,_this){
    wx.hideLoading();
    console.log(customerId,code,'jjj')
    var encrypt = util.HMAC_sort([customerId], code);
    util.Req(app.globalData.url+app.globalData.config + '/home/info', 'get', { customerId: customerId, digest: encrypt }, {
      'content-type': 'application/json'
    }, _this, function (res) {
     
      _this.setData({
        homeBanner:res.data.bannerList
      })
      _this.setData({
        latestMsg:res.data.newsList
      })
      // console.log(this.data,'fff')
    }, function () { })
  },
  onShow(){
    // wx.showLoading({
    //   title: '稍候'
    // })
    var _this = this;
    // wx.request({
    //   url:app.globalData.url+app.globalData.config + '/home/info',
    //   method: 'get',
    //   data: {},
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded',
    //   },
    //   success: function (data) {
    //     console.log(data,'ggg')
    //     if (data.data.code == '0') {
          
    //     }else {
    //       wx.showModal({
    //         title: '提示',
    //         content: '系统出错，稍后重试'
    //       })
    //     }
    //   }
    // })
    // wx.getSetting({
    //   success(res) {
    //     console.log(res,'ffffddd')
    //     if (res.authSetting['scope.userInfo']) {
    //       console.log('rrr')
    //       //判断session是否过期
    //       wx.checkSession({
            // success: function (res) {
              // customerId
              util.CodeId().then(function (arr) {
                _this.setData({
                  code: arr[0],
                  customerId: arr[1]
                });
                console.log('rrrrr')
                _this.getIndexInfo(arr[1], arr[0], _this);
              });
            // },
            // fail: function (res) {
            //   wx.hideLoading();
            //   util.Allogin().then(function (arr) {
            //     _this.setData({
            //       code: arr[0],
            //       customerId: arr[1]
            //     });
            //     _this.getIndexInfo(arr[1], arr[0], _this);
            //   })
            // }
          // })
        // } else {
        //   wx.hideLoading();
        //   _this.setData({
        //     loading: false,
        //     userlogin: false
        //   })
        // }
      // }
    // })
  },
  toAccount(e){
    const url=encodeURIComponent(e.currentTarget.dataset.url)
    // encodeURIComponent(e.currentTarget.dataset.text.planDetail)
    console.log(url,'yy')
    wx.navigateTo({
      url: '/pages/account/index?url='+url,
    })
  },
  getUserProfile(e) {
    var _that=this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if (!wx.getStorageSync('storage_info')) {
      util.getUserProfile().then(function(arr){
        _that.setData({
            code: arr[0],
            customerId: arr[1]
        });
        _that.getIndexInfo(arr[1], arr[0], _that);
      });
    }else{
      wx.navigateTo({
        url: '/pages/allCards/index',
      })
    }
    // wx.getUserProfile({
    //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
