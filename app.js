//app.js
var util = require('/utils/util.js');
App({
  globalData:{
   now_num:"",
   now:'',
   avatarUrl: "",
   nickName: "",
   city:"",
   openid:"",
   sex:"",
   latitude:24.479834,
   longitude:118.089425,
   deleteList:[],
   deleteNoticeList:[],
   deleteNoticeList_:[]
  },
  
  checkUser:function(){//检查用户是否授权
   wx.getSetting({    
    success: res => {
     if (res.authSetting['scope.userInfo']) {
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      wx.getUserInfo({
       success: res => {
         this.globalData.avatarUrl=res.userInfo.avatarUrl,
         this.globalData.nickName=res.userInfo.nickName
         this.globalData.city=res.userInfo.city
         this.globalData.sex=res.userInfo.gender
         this.getOpenid() 
       }
      })
     } else {
      wx.redirectTo({
       url:"/pages/accredit/accredit",
      }) 
     }
    }
   })
  },

  getCurrentDate:function(){/**获取系统当前时间 */
   var now = new Date()
   this.globalData.now=now
   this.globalData.now_num=new Number(now);/*时间戳*/ 
  },

 getOpenid: function () {/**云函数获得用户openid */
  wx.cloud.callFunction({
   name: 'login',
   success: res => {
   this.globalData.openid=res.result.openid
    this.checkTeamApply(res.result.openid)
    this.userInit(res.result.openid)
   }
  }) 
  },

 getMyLocation: function () {/**获得用户位置 */
  wx.getLocation({
   type: 'wgs84',
   success: res => {
    this.globalData.latitude=res.latitude,
    this.globalData.longitude = res.longitude  
   }, 
  })
 },

 checkTeamApply: function (openid) {/** 加载后判断有没有新球队申请*/
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("delete_team_apply").get({
   success: res => {
    for (var i = 0; i < res.data.length; i++) {
     this.globalData.deleteList[i] = res.data[i].message_id
    }
    db.collection("team_apply").where({ /**找出所有未处理过的球队申请 */
     leader_id:openid,
     _id: _.nin(this.globalData.deleteList)
    }).get({
     success:res=>{
      if (res.data.length>0){
       wx.showTabBarRedDot({
        index: 3,
       })
      }
     }
    })
   }
  })
  this.checkNearTeamYueqiu(openid)
  this.checkTeamMessage(openid) 
  this.checkYueqiuMessage(openid)
  this.checkNearYueqiu(openid)
  this.checkNewPriMessage(openid)
 },

 checkTeamMessage:function(openid){/**是否有球队约球信息改变的消息 只要消息不删除就会一直有红点*/
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("delete_team_notice").get({
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     this.globalData.deleteNoticeList[i]=res.data[i].notice_id
    }
    db.collection("team_notice").where({
     warn_id: openid,
     _id: _.nin(this.globalData.deleteNoticeList)
    }).get({
     success:res=>{
      if(res.data.length>0){
       wx.showTabBarRedDot({
        index: 3,
       })
      }
     }
    })
   }
  })
 },

 checkNearTeamYueqiu: function (openid) {/**未来一天有没有球队约球开始 */
  const db = wx.cloud.database()
  db.collection("team_pk_list").where({_openid:openid}).get({
   success: res => {
    for (var i=0;i<res.data.length;i++){
     db.collection("yueqiu_team_information").where({_id:res.data[i].game_id}).get({
      success:res=>{
       if(res.data[0].team_date_num-86400000<this.globalData.now_num&res.data[0].team_date_num> this.globalData.now_num) {
        db.collection("team_notice").where({/**防止出现重复消息 */
         team_yueqiu_id: res.data[0]._id,
         warn_id:openid,
         type: 1
        }).get({
         success:res_=>{
          if(res_.data.length==0){/**如果这是第一条球队约球即将开始的提醒 则创建一条提醒 */
           db.collection("team_notice").add({
            data: {
             content:"您有球队约球即将开始，请查看",
             warn_id:openid,
             team_yueqiu_id:res.data[0]._id,
             type: 1
            },
            success:res=>{
             wx.showTabBarRedDot({
              index: 3,
             })
            }
           })
          }
         }
        })
       }
      }
     })
    }
   }
  })
 },

 checkYueqiuMessage: function (openid){/**是否有个人约球信息改变 不删除一直有红点*/
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("detele_yueqiu_notice").get({
   success:res=>{
    for (var i=0;i<res.data.length;i++){
     this.globalData.deleteNoticeList_[i] = res.data[i].notice_id
    }
    db.collection("team_notice").where({
     warn_id: openid,
     _id: _.nin(this.globalData.deleteNoticeList_)
    }).get({
     success:res=>{
      if (res.data.length>0) {
       wx.showTabBarRedDot({
        index: 3,
       })
      }
     }
    })
   }
  })
 },

 checkNearYueqiu: function (openid) {/**看未来一天有没有个人约球开始 */
  const db = wx.cloud.database()
  db.collection("join_list").where({ _openid: openid }).get({
   success: res => {
    for (var i = 0; i < res.data.length; i++) {
     db.collection("yueqiu_information").where({ _id: res.data[i].yueqiu_id }).get({
      success: res => {
       if (res.data[0].i_date_num - 86400000 < this.globalData.now_num & res.data[0].i_date_num > this.globalData.now_num) {
        db.collection("yueqiu_notice").where({/**防止出现重复消息 */
         yueqiu_id: res.data[0]._id,
         warn_id:openid,
         type: 1
        }).get({
         success: res_ => {
          if (res_.data.length == 0) {
           db.collection("yueqiu_notice").add({
            data: {
             content: "您有球队约球即将开始，请查看",
             warn_id: openid,
             yueqiu_id: res.data[0]._id,
             type: 1
            },
            success: res => {
             wx.showTabBarRedDot({
              index: 3,
             })
            }
           })
          }
         }
        })
       }
      }
     })
    }
   }
  })
 },

 checkNewPriMessage:function(openid){/**检查是否有新私信 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("rec_readed").where({ _openid:openid}).get({
   success:res=>{
    var j=0
    for(var i=0;i<res.data.length;i++){    
     db.collection("private_message").where(_.or([/**记录我们之间已经发送了多少条信息 */
      {
       _openid:openid,
       sendto_id:res.data[i].sendto_id
      },
      {
       _openid: res.data[i].sendto_id,
       sendto_id:openid
      }
      ])).get({
       success:res_=>{
        if(res.data[j].num<res_.data.length){/*如果有的信息没有读则提示*/        
         wx.showTabBarRedDot({
          index: 3,
         })
        }
        j++
       }
      })
    }
   }
  })
 },

 userInit:function(openid){/**用户第一次加载小程序时自动生成个人信息集合 */
  const db=wx.cloud.database()
  db.collection("user_list").where({_openid:openid}).get({
   success:res=>{
    if(res.data.length==0){
     db.collection("user_list").add({
      data:{
       avatarUrl: this.globalData.avatarUrl,
       nickName:this.globalData.nickName,
       sex:this.globalData.sex,
       city:this.globalData.city
      }
     })
    }else{
     db.collection("user_list").doc(res.data[0]._id).update({
      data:{
       avatarUrl: this.globalData.avatarUrl,
       nickName: this.globalData.nickName,
       sex: this.globalData.sex,
       city: this.globalData.city
      },
     })
    }
   }
  })
 },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () { 
   this.getCurrentDate()
   if (!wx.cloud) {
    console.error()
   } else {
    wx.cloud.init({
     traceUser: true,
    })
   }
   this.checkUser()
  },
   

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
   this.getMyLocation()
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
