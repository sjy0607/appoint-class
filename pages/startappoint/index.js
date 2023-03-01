const util = require("../../utils/util");
const app = getApp()
// pages/startappoint/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateList:[],
    indicatorDots:true,
    isCanAppoint:true,
    nowDate:'',
    code:'',
    id:'',
    title:'',
    address:'',
    list:[],
    selectInfo:[],
    selectTimeList:[],
    customerId:'',
    year:'',
    clickIndex:0,
    currentMonth:0,
    sysmonth:'',
    times:[
    //   {

    //   date:'15:00-16:00',
    //   paymentPrice:'55'
    // },{
    //   date:'15:00-16:00',
    //   paymentPrice:'55'
    // },{
    //   date:'15:00-16:00',
    //   paymentPrice:'55'
    // },{

    //   date:'15:00-16:00',
    //   paymentPrice:'55'
    // }
  ]
  },
  submit(){
    if(!this.data.selectInfo.length){
      wx.showToast({
        title: '请选择预定时间',
        icon:'error'
      })
      return;
    }
    this.setData({
      selectTimeList:this.data.selectInfo.map(i=>{
        return{
          date:i.date,
          periodId:i.periodId
        }
      })
    })
    console.log(this.data.selectTimeList,'eee')
    wx.navigateTo({
      url: '/pages/pay/index?timeList='+JSON.stringify(this.data.selectTimeList)
    })
    // var encrypt = util.HMAC_sort([customerId,7,_this.data.currentDate], code);
    // util.Req(app.globalData.url+app.globalData.config + '/classroom/usable-time', 'get', {customerId: customerId,digest:encrypt,id:7,date:_this.data.currentDate}, {
    //   'content-type': 'application/json'
    // }, _this, function (res) {

    // }, function () { })
  },
  toClassroom(){
    wx.navigateBack({
      delta: 0,
    })
  },
  selectTime(e){
    console.log(e,'ttt')
    const list=[]
    var item= e.currentTarget.dataset.item;
   
    console.log(item,'ooo')
    list.push(item)
    
   
    const index=this.data.selectInfo.findIndex((i)=>{
      return i.time==item.time
    })
    if(!item.usable){
      wx.showToast({
        title: '该时间段已约满',
        icon:'error'
      })
      return;
    }
    if(index>-1){
      wx.showToast({
        title: '您不可选择同时间段的时间',
        icon:'error'
      })
      return;
    }
    this.setData({
      selectInfo:this.data.selectInfo.concat(list),
      isCanAppoint:false
    })
    console.log(this.data.list,'ffff')
  },
  closeContain(e){
    const periodId=e.currentTarget.dataset.id;
    console.log(periodId,'索引')
    const list=this.data.selectInfo;
    const index=list.findIndex(i=>{
      return i.periodId==periodId
    })
    if(index>-1){
      if(this.data.selectInfo.length==1){
        this.setData({
          selectInfo:[]
        })
      }else{
        this.setData({
          selectInfo:list.splice(index,1)
        })
      }
      
    }
    
    console.log(index,'索引')
   
  },
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-')
  },
  // 格式化数字
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myDate = new Date(); //获取系统当前时间
    var sysmonth = myDate.getMonth() + 1
    var year=myDate.getFullYear();
    var nowDate = myDate.getDate();   //当前是本月几日
    var today = myDate.toLocaleDateString();  //今日年月日
    that.setData({
      currentMonth:sysmonth,
      nowDate: nowDate,
      sysmonth: sysmonth,
      currentDate:util.formatDate(myDate),
      year:year,
      id:options.id,
      title:options.title,
      address:options.address
    })
    that.initData();
  },
   // 获取日期详情
   getDateInfo(ts) {
    const date = new Date(ts);
    const weekArr = new Array("日", "一", "二", "三", "四", "五", "六");
    const week = date.getDay();
    console.log(date,'ooo',week)
    let dateString = this.formatTime(date);
    let shortDateString = dateString.replace(/\//g, '-').substring(5, 10).replace(/-/g, '月') + "日";
    if (date.getDate() < 10) {
      shortDateString = shortDateString.replace(/0/g, '');
    }
    return {
      shortDateString,
      dateString,
      month: date.getMonth() + 1,
      day: date.getDate(),
      week: weekArr[week]
    }
  },
  preMonth(){
    if(this.data.sysmonth==1){
      this.setData({
        year:this.data.year-1,
        sysmonth:12
      })
    }else{
      this.setData({
        sysmonth:this.data.sysmonth-1,
        clickIndex:0
      })
     
    }
    const next=+new Date(this.data.year,this.data.sysmonth-1,1)
    if(this.data.sysmonth==this.data.currentMonth){
      this.initData();
      return
    }
    this.initData(next)
  },
  nextMonth(){
    if(this.data.sysmonth==12){
      this.setData({
        year:this.data.year+1,
        sysmonth:1
      })

    }else{
      this.setData({
        sysmonth:this.data.sysmonth+1,
        clickIndex:0
      })
     
      // for (let i = 1; i < 31; i++) {
      //   let obj = this.getDateInfo(nowDateTime + i * 24 * 60 * 60 * 1000);
      //   obj.isChoose = i == 0;
      //   dateList.push(obj);
      // }
      // this.setData({
      //   dateList,
      //   clickIndex: 30,
      //   scrollLeftIndex: 30
      // });
    }
    const next=+new Date(this.data.year,this.data.sysmonth-1,1)
    if(this.data.sysmonth==this.data.currentMonth){
      this.initData();
      return
    }
    this.initData(next)
  },
  initData(ts) {
    var nowDateTime=+new Date();
    console.log(nowDateTime,'ppp',ts)
    let dateList = [];
    let left=0
    var totalDays=new Date(this.data.year,this.data.sysmonth,0).getDate();
    var remainDays=totalDays-this.data.nowDate
    if(ts){
      nowDateTime=ts
      remainDays=totalDays-1
    }
    for (let i = 0; i <= remainDays; i++) {
      let obj = this.getDateInfo(nowDateTime + i * 24 * 60 * 60 * 1000);
      obj.isChoose = i == 0;
      dateList.push(obj);
    }
    if(ts){
      this.setData({
        dateList,
        clickIndex: null,
        scrollLeftIndex:0
      });
    }else{
      dateList.forEach((i,index)=>{
        console.log(i,'kk',index,this.data.sysmonth, this.data.nowDate)
        if(i.month==this.data.sysmonth&& i.day == this.data.nowDate){
          left=index
        }
      })
      console.log(left,'pp')
      this.setData({
        dateList,
        clickIndex: left,
        scrollLeftIndex:left
      });
    }
   
  },
  clickDate(e){
    var that = this;
    console.log('点击日期携带的下标：', e);  //当前的点击的日期
    var index = e.currentTarget.dataset.index;
    console.log(that.data.dateList[index].dateString.split(' ')[0],'uuu')
    that.setData({
      clickIndex: index,
      list:[],
      currentDate:that.data.dateList[index].dateString.split(' ')[0]
    });
    
    // const selectDate=that.data.dateList[index].date;
    that.getUseTimeList(that.data.customerId,that.data.code,that)
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
      _this.getUseTimeList(arr[1],arr[0],_this)
    });
  },
  getUseTimeList(customerId,code,_this){
    var encrypt = util.HMAC_sort([customerId,_this.data.id,_this.data.currentDate], code);
    console.log(customerId,'==',_this.data.currentDate,'===')
    util.Req(app.globalData.url+app.globalData.config + '/classroom/usable-time', 'get', {customerId: customerId,digest:encrypt,id:_this.data.id,date:_this.data.currentDate}, {
      'content-type': 'application/json'
    }, _this, function (res) {
      // res.data.items.forEach((i)=>{
      //   i.selected=false
      // })
      const length=res.data.items.length;
      let newList=[]
      console.log(Math.ceil(res.data.items.length/9))
      if(!length)return;
      if(length<9){
        newList.push(res.data.items)
          _this.setData({
            times:1,
            list:newList
          })
      }
      else{
        newList.push(res.data.items.slice(0,9))
        _this.setData({
          times:Math.ceil(res.data.items.length/9),
          list:newList
        })
        console.log(_this.data.list,'iiuuu')
        if(_this.data.times==2){
          var newList1=[];
          newList1.push(res.data.items.slice(9,res.data.items.length-1))
          _this.setData({
            list:newList.concat(newList1)
          })
        }
        else if(_this.data.times==3){
          var newList2=[];
          newList2.push(res.data.items.slice(9,18))
          newList2.push(res.data.items.slice(18,res.data.items.length))
          _this.setData({
            list:newList.concat(newList2)
          })
        }
      }
      
      console.log(_this.data.list,'oo')
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