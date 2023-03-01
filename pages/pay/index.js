// pages/pay/index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:'',
    customerId:'',
    select_card_id:'',
    select_name:'',//选中的卡名
    isWxPay:false,
    ip:'',
    date:'',
    infoList:[],
    list:[],
    price:0,
    isWxin:false,
    discountPrice:0,
    period:''
  },
  // selectPay(){
  //   this.setData({
  //     isWxin:!this.data.isWxin
  //   })
  // },
  closeContain(e){
    const periodId=e.currentTarget.dataset.id;
    console.log(e,'索引')
    const list=this.data.list;
    const index=list.findIndex(i=>{
      return i.periodId==periodId
    })
    if(index>-1){
      if(this.data.list.length==1){
        this.setData({
          infoList:[]
        })
      }else{
        this.setData({
          infoList:list.splice(index,1)
        })
      }
      
    }
    
    console.log(index,'索引')
   
  },
  pay(){
    var _this=this;
    var encrypt = util.HMAC_sort([_this.data.customerId,_this.data.select_card_id,0,_this.data.ip,JSON.stringify(this.data.list)], _this.data.code);
    util.Req(app.globalData.url+app.globalData.config + '/order/create', 'post', 
    {customerId: _this.data.customerId,digest:encrypt,goodsType:0,periodInfoList:this.data.list,customerMemberCardId:_this.data.select_card_id,ip:_this.data.ip}, {
      'content-type': 'application/json'
    }, _this, function (res) {
        // const appId=res.data.appId;
        if(!res.data){
          wx.showToast({
            title: '支付成功',
          })
          wx.navigateTo({
            url: '/pages/appoint/unstart/index',
          })
        }else{
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
                url: '/pages/appoint/unstart/index',
              })
            },
            cancel(res){
              wx.redirectTo({
                url: '/pages/myorder/index?isfrompay=true',
              })
            },
            fail (res) {
              wx.redirectTo({
                url: '/pages/myorder/index?isfrompay=true',
              })
              // wx.navigateTo({
              //   url: '/pages/myorder/index?isfrompay=true',
              // })
            }
          })
        }
        
    }, function () { })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'ssppp')
    if(options.timeList){
      wx.setStorageSync('selectTimeList', options.timeList);
      // wx.setStorageSync('date', options.date);
      this.setData({
        list:JSON.parse(options.timeList)
      })
    }
   console.log(this.data.list,'tttt')
    if(options.card_id){
      console.log(wx.getStorageSync('periodId'),wx.getStorageSync('date'),'oo')
      this.setData({
        select_card_id:options.card_id,
        list:JSON.parse(wx.getStorageSync('selectTimeList')),
        select_name:options.select_name
      })
      // this.getOrderInfo(this.data.customerId,this.data.code,this)
    }
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
      console.log(arr,'pppp')
      _this.setData({
        code: arr[0],
        customerId: arr[1]
      });
      _this.getOrderInfo(arr[1],arr[0],_this)
    });
  },
  useCard(){
    wx.navigateTo({
      url: '/pages/cardsDiscount/index?id='+this.data.infoList[0].periodId,
    })
  },
  getOrderInfo(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.select_card_id,JSON.stringify(this.data.list)], code);
    util.Req(app.globalData.url+app.globalData.config + '/order/pre/classroom-reserve/info', 'post', 
    {customerId: customerId,digest:encrypt,periodInfoList:this.data.list,customerMemberCardId:this.data.select_card_id}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      _this.setData({
        infoList:res.data.classroomUsableTimeRespList,
        price:res.data.price,
        discountPrice:res.data.discountPrice
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