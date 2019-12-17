var util = require('../../utils/util.js')
const app=getApp()
Page({
 data: {
  str:"人数已满",
  location:'',
  latitude:'',
  longitude:'',
  mylist:[],
  myDis:[], 
  less5:[],
  less10:[],
  isRuleTrue:false,
  isRuleTrue1:false,
  navbar: ['个人', '球队'],
  currentTab: 0 ,
  hide1:true,
  hide2: true,
  lessten: false,
  greatten: false,
  three: false,
  seven: false,
  sevenlater: false,
  fivek: false,
  tenk:false,  
  myTeamDis: [],
  teamList:[],
  numList:[],
  teamInf:[],
  flag:[],
  dayList:[],
 },

 navbarTap: function (e) {/**顶部导航栏 */
  this.setData({
   currentTab: e.currentTarget.dataset.idx
  })
 },
 swiperChange: function (e) {/**切换 */
  this.setData({
   currentTab: e.detail.current,
  })
 },

 add: function () {/**点击加号显示和隐藏发起遮罩层  */
  this.setData({
   isRuleTrue: !this.data.isRuleTrue,
   hide2: !this.data.hide2
  })
  const animation = wx.createAnimation({/**旋转效果 */
   duration: 500,
   timingFunction: 'ease',
  })
  if(this.data.hide2==true){ 
   animation.rotate(90).step()
  }else{
   animation.rotate(-90).step() 
  }
  this.setData({
   animationData: animation.export(),
  }) 
 },
 lookfor: function () {/**点击放大镜显示和隐藏查找遮罩层 */
  this.setData({
   isRuleTrue1: !this.data.isRuleTrue1,
   hide1: !this.data.hide1
  })
  var animation = wx.createAnimation({/**放大缩小效果 */
   duration: 500,
   timingFunction: 'ease',
  })
  this.animation = animation
  if (this.data.hide1 == true) {
   animation.scale(1,1).step()
  } else {
   animation.scale(1.5,1.5).step()
  }
  this.setData({
   animationData1: animation.export()
  }) 
 },
 cancelMack: function () {/**用于返回约球页面、查找后不显示遮罩层 */
  this.setData({
   isRuleTrue1: false,
   hide1: true
  })
 },
 show: function () {/**点击遮罩层显示全部 */
  this.setData({
   lessten: false,
   greatten: false,
   three: false,
   seven: false,
   sevenlater: false,
   fivek: false,
   tenk: false,
  })
  var animation = wx.createAnimation({/**放大缩小效果 */
   duration: 500,
   timingFunction: 'ease',
  })
  this.animation = animation
   animation.scale(1, 1).step()
  this.setData({
   animationData1: animation.export()
  }) 
  this.showAll()
  this.cancelMack()
 },
 pick1:function(){/**筛选按钮 点击第一个*/
  this.setData({
   lessten:!this.data.lessten
  })
  if(this.data.greatten==true&&this.data.lessten==true){
   this.setData({
    greatten: !this.data.greatten
   })
  }
 },
 pick2:function(){
  this.setData({
   greatten:!this.data.greatten
  })
  if(this.data.greatten==true&&this.data.lessten== true){
   this.setData({
    lessten:!this.data.lessten
   })
  }
 },
 pick3:function(){
  this.setData({
   three: !this.data.three
  })
  if((this.data.seven==true&&this.data.three==true)||(this.data.sevenlater==true&&this.data.three== true)){
   this.setData({
    seven:false,
    sevenlater:false
   })
  }
 },
 pick4:function(){
  this.setData({
   seven: !this.data.seven
  })
  if ((this.data.three == true && this.data.seven == true) || (this.data.sevenlater == true && this.data.seven == true)) {
   this.setData({
    three: false,
    sevenlater: false
   })
  }
 },
 pick5:function(){
  this.setData({
   sevenlater: !this.data.sevenlater
  })
  if ((this.data.three == true && this.data.sevenlater == true) || (this.data.seven == true && this.data.sevenlater == true)) {
   this.setData({
    seven: false,
    three: false
   })
  }
 },
 pick6:function(){
  this.setData({
   fivek: !this.data.fivek
  })
  if ((this.data.fivek == true && this.data.tenk== true)) {
   this.setData({
    tenk:false
   })
  }
 },
 pick7:function(){
  this.setData({
   tenk: !this.data.tenk
  })
  if ((this.data.fivek == true && this.data.tenk == true)) {
   this.setData({
    fivek: false
   })
  }
 },

 launchBall:function(){//点击个人发起
  wx.navigateTo({
   url: "../yueqiupage_content/launchBall/launchBall",
  })
 },
 teamLaunch: function () {//点击团队发起
  wx.navigateTo({
   url: "../yueqiupage_content/teamLaunchBall/teamLaunchBall",
  })
 },

 showAll:function(){//显示所有个人约球
  const db = wx.cloud.database()
  const _=db.command
  db.collection('yueqiu_information').where({i_date_num:_.gt(app.globalData.now_num)}).get({
   success: res => { 
    this.showNum(res.data)
    this.getDis(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 }, 
 showTeamAll:function(){/**显示所有球队约球 */
  const db = wx.cloud.database()
  const _=db.command
  db.collection('yueqiu_team_information').where({ team_date_num: _.gt(app.globalData.now_num)}).get({/**显示是否已满 */
   success: res => {
    var j=0
    for(var i=0;i<res.data.length;i++){
     db.collection("team_pk_list").where({game_id:res.data[i]._id}).get({
      success:res=>{
       var k="teamInf["+j+"]"
       if(res.data.length==2){
        this.setData({
         [k]:"匹配完成"
        })
        j++
       }else{
        this.setData({
         [k]:"等待对手中"
        })
        j++
       }
      }
     })
    }
    this.showTeamDay(res)
    this.getTeamDis(res)
    this.setData({
     teamList: res.data,
    })
   }
  })
 },
 showNum:function(array){/**显示个人约球已有多少人加入 pc端有显示问题*/
  const db=wx.cloud.database()
  /*this.setData({
   numList:[]
  })*/
  var j=0;
  for (var i in array){  
   db.collection("join_list").where({ yueqiu_id: array[i]._id}).count({
    success:res=>{
     var k = "numList[" + j + "]"
     if(array[j].i_num==res.total){
      this.setData({
       [k]:'人数已满'
      })
     }else{
      this.setData({
       [k]: '已有'+res.total+'人加入'
      }) 
     }  
     j++   
    }
   })
  }  
 },
 showDay:function(array){/**显示距离剩多少天  */
  for(var i=0;i<array.length;i++){
   var k='dayList['+i+']'
   this.setData({
    [k]:((array[i].i_date_num-app.globalData.now_num)/86400000).toFixed(0)
   })
  }
 },
 showTeamDay: function (array) {/**显示距球队约球离剩多少天  */
  for (var i = 0; i < array.data.length; i++) {
   var k = 'day1List[' + i + ']'
   this.setData({
    [k]: ((array.data[i].team_date_num - app.globalData.now_num) / 86400000).toFixed(0)
   })
  }
 },


 getDis:function(array){/**获得用户与约球地点的距离 */
  for (var i = 0; i < array.length; i++) {
   var k = 'myDis[' + i + ']'
   this.setData({
    [k]: util.distance(this.data.latitude, this.data.longitude, array[i].i_latitude, array[i].i_longitude)
   })
  } 
 },
 getTeamDis: function (res) {/**获得约球球队与球队约球地点的距离 */
  for (var i = 0; i < res.data.length; i++) {
   var k = 'myTeamDis[' + i + ']'
   this.setData({
    [k]: util.distance(this.data.latitude, this.data.longitude, res.data[i].team_latitude, res.data[i].team_longitude)
   })
  }
 },
 getDisLess5km:function(res){/**获得小于5km和10km两个约球数组 */
  this.setData({
   less5:[],
   less10:[],
   myDis: [],   
  })
  for (var i = 0; i < res.data.length; i++) {
   var k = 'myDis[' + i + ']'
   this.setData({
    [k]: util.distance(this.data.latitude, this.data.longitude, res.data[i].i_latitude, res.data[i].i_longitude)
   })
  } 
  var a = 0, b = 0
  for(var i=0;i<this.data.myDis.length;i++){
   var less5=new Array()
   var n = 'less5[' + a + ']'
   var m = 'less10[' + b + ']'
   if (this.data.myDis[i]<5){     
   this.setData({
    [n]: res.data[i]
   })
   a++   
   }
   if (this.data.myDis[i] < 10) {
    this.setData({
     [m]: res.data[i]
    })
    b++
   } 
  }
 },




 show1:function(){/** 查找小于十人的约球*/
  const db=wx.cloud.database()
  const _=db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.gt(app.globalData.now_num) }])).get({
   success:res=>{
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist:res.data
    })  
   }
  })
 },
 show2:function(){/**查找大于十人的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) },{ i_date_num: _.gt(app.globalData.now_num) }])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show3: function () {/**查找日期3天内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.lt(app.globalData.now_num+259200000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show4: function () {/**查找日期7天内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show5: function () {/**查找日期7天外的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.gt(app.globalData.now_num + 604800000) }).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show6: function () {/**查找距离5km内的约球 */
  const db = wx.cloud.database()
  const _=db.command
  db.collection('yueqiu_information').where({ i_date_num: _.gt(app.globalData.now_num) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist:this.data.less5
    })
   }
  })
 },
 show7: function () {/**查找距离10km内的约球 */
  const db = wx.cloud.database()
  const _=db.command
  db.collection('yueqiu_information').where({ i_date_num: _.gt(app.globalData.now_num)}).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show8:function(){/**查找人数小于10人且时间为3天内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num))}
  ])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show9: function () {/**查找人数小于10且时间为7天内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }
  ])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show10: function () {/**查找人数小于10且时间为7天外的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.gt(app.globalData.now_num + 604800000) }
  ])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show11: function () {/**查找人数小于10且距离为5km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.gt(app.globalData.now_num) }])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show12: function () {/**查找人数小于10且距离为10km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.gt(app.globalData.now_num) }])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show13: function () {/**查找人数大于10人且时间为3天内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) }
  ])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show14: function () {/**查找人数大于10且时间为7天内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }
  ])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show15: function () {/**查找人数大于10且时间为7天外的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.gt(app.globalData.now_num + 604800000) }
  ])).get({
   success: res => {
    this.getDis(res.data)
    this.showNum(res.data)
    this.showDay(res.data)
    this.setData({
     mylist: res.data
    })
   }
  })
 },
 show16: function () {/**查找人数大于10且距离为5km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.gt(app.globalData.now_num) }])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show17: function () {/**查找人数大于10且距离为10km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.gt(app.globalData.now_num) }])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show18: function () {/**查找日期3天内且距离为5km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show19: function () {/**查找日期3天内且距离为10km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show20: function () {/**查找日期7天内且距离为5km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show21: function () {/**查找日期7天内且距离为10km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show22: function () {/**查找日期7天后且距离为5km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.gt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show23: function () {/**查找日期7天后且距离为10km内的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where({ i_date_num: _.gt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) }).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show24: function () {/**查找人数小于10、时间为3天内、距离为5km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show25: function () {/**查找人数小于10、时间为3天内、距离为10km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show26: function () {/**查找人数小于10、时间为7天内、距离为5km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show27: function () {/**查找人数小于10、时间为7天内、距离为10km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show28: function () {/**查找人数小于10、时间为7天后、距离为5km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.gt(app.globalData.now_num + 604800000) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show29: function () {/**查找人数小于10、时间为7天后、距离为10km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.lte(10) }, { i_date_num: _.gt(app.globalData.now_num + 604800000) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show30: function () {/**查找人数大于10、时间为3天内、距离为5km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show31: function () {/**查找人数大于10、时间为3天内、距离为10km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 259200000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show32: function () {/**查找人数大于10、时间为7天内、距离为5km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show33: function () {/**查找人数大于10、时间为7天内、距离为10km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000).and(_.gt(app.globalData.now_num)) },
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 show34: function () {/**查找人数大于10、时间为7天后、距离为5km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.gt(app.globalData.now_num + 604800000)},
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less5)
    this.showNum(this.data.less5)
    this.showDay(this.data.less5)
    this.setData({
     mylist: this.data.less5
    })
   }
  })
 },
 show35: function () {/**查找人数大于10、时间为7天后、距离为10km内的约球的约球 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection('yueqiu_information').where(_.and([
   { i_num: _.gt(10) }, { i_date_num: _.lt(app.globalData.now_num + 604800000)},
  ])).get({
   success: res => {
    this.getDisLess5km(res)
    this.getDis(this.data.less10)
    this.showNum(this.data.less10)
    this.showDay(this.data.less10)
    this.setData({
     mylist: this.data.less10
    })
   }
  })
 },
 


showForSearch:function(){/**查找后约球页面显示 */
 wx.showLoading({
  title: '刷新中..',
  mask:true,
 })
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false){
   this.showAll()   
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false){
   this.show1()   
  }
  if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show2()   
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show3()   
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show4()  
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == false && this.data.tenk == false) {
   this.show5()  
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show6()   
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show7()   
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show8()   
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show9()   
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == false && this.data.tenk == false) {
   this.show10()  
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show11()   
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show12()   
  }
  if (this.data.lessten == false && this.data.greatten == true && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show13()  
  }
  if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == false) {
   this.show14()   
  }
  if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == false && this.data.tenk == false) {
   this.show15() 
  }
  if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show16()   
  }
  if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show17()
   
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show18()
   
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show19()
   
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show20()
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show21()
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == true && this.data.tenk == false) {
   this.show22()
  }
  if (this.data.lessten == false && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == false && this.data.tenk == true) {
   this.show23()
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show24()
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show25()
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
   this.show26()
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
   this.show27()
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == true && this.data.tenk == false) {
   this.show28()
  }
  if (this.data.lessten == true && this.data.greatten == false && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == false && this.data.tenk == true) {
   this.show29()
  }
 if (this.data.lessten == false && this.data.greatten == true && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
  this.show30()
 }
 if (this.data.lessten == false && this.data.greatten == true && this.data.three == true && this.data.seven == false && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
  this.show31()
 }
 if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == true && this.data.tenk == false) {
  this.show32()
 }
 if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == true && this.data.sevenlater == false && this.data.fivek == false && this.data.tenk == true) {
  this.show33()
 }
 if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == true && this.data.tenk == false) {
  this.show34()
 }
 if (this.data.lessten == false && this.data.greatten == true && this.data.three == false && this.data.seven == false && this.data.sevenlater == true && this.data.fivek == false && this.data.tenk == true) {
  this.show35()
 }
  
   this.cancelMack()
 var animation = wx.createAnimation({/**放大缩小效果 */
  duration: 500,
  timingFunction: 'ease',
 })
 this.animation = animation
 animation.scale(1, 1).step()
 this.setData({
  animationData1: animation.export()
 }) 
   setTimeout(function () {
    wx.hideLoading()
   }, 2000)
},

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  this.setData({
   latitude:app.globalData.latitude,
   longitude:app.globalData.longitude
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
 onShow: function (e) {
  this.showForSearch()
  this.showTeamAll()
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
  this.onShow()//手动刷新约球页面

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