// pages/cardsDiscount/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    customerId:'',
    selectId:'',
    periorId:'',
    cardList:[
    //   {
    //   type:0,
    //   hours:25,
    //   price:1200.00
    // },{
    //   type:1,
    //   hours:25,
    //   price:1200.00
    // },{
    //   type:2,
    //   hours:25,
    //   price:1200.00
    // }
  ]
  },
  cancel(){
    wx.navigateBack({
      delta: 0,
    })
    // wx.navigateTo({
    //   url: '/pages/pay/index',
    // })
  },
  toPurchase(){
    wx.navigateTo({
      url: '/pages/allCards/index',
    })
  },
  confirm(){
    const index=this.data.cardList.findIndex(i=>{
      return i.id==this.data.selectId
    })
    if(index>-1){
      const type=this.data.cardList[index].type;
      let name='';
      if(type==0){
        name='SMALL'
      }else if(type==1){
        name='MIDDLE'
      }else{
        name='MAX'
      }
      wx.navigateTo({
        url: '/pages/pay/index?card_id='+this.data.selectId+'&select_name='+name,
      })
    }
   
  },
  radioChange(e){
    console.log(e.detail.value,'tttt')
    this.setData({
      selectId:e.detail.value,
    })
    const items = this.data.cardList
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].id === e.detail.value
    }

    this.setData({
      cardList:items
    })
    console.log(this.data.cardList,'rr')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        periorId:options.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getCardDetail(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.periorId], code);
    util.Req(app.globalData.url+app.globalData.config + '/member-card/mine/usable/list', 'get', {customerId: customerId,digest:encrypt,periodId:_this.data.periorId}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      if(!res.data.items.length)return;
      res.data.items[0].checked=true
      _this.setData({
        cardList:res.data.items,
        selectId:res.data.items[res.data.items.length-1].id
      })
      console.log(_this.data.selectId,'eeeee',_this.data.cardList)
    }, function () { })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this=this;
    if(wx.getStorageSync('periodId')){
      this.setData({
        periorId:wx.getStorageSync('periodId')
      })
    }
    
    util.CodeId().then(function (arr) {
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      _this.getCardDetail(arr[1],arr[0],_this)
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