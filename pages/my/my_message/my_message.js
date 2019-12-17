Page({

  /**
   * 页面的初始数据,本页面中的type:0为球队约球信息发生改变的消息，type:1为球队约球即将开始的消息，两种不同类型的消息删除用的方式不一样
   */
  data: {
   navbar: ['球队消息', '活动消息','我的私信'],
   currentTab: 0,
   messageList:[],
   deleteList:[],
   deleteList_: [],
   deleteList__: [],
   selectedFlag: [false, false],
   noticeList:[],
   yueqiuList:[],
   chatList:[], 
   iconList:[]
  },

 changeToggle: function (e) {/**箭头 */
  var index = e.currentTarget.dataset.index;
  if (this.data.selectedFlag[index]) {
   this.data.selectedFlag[index] = false;
  } else {
   this.data.selectedFlag[index] = true;
  }
  this.setData({
   selectedFlag: this.data.selectedFlag
  })
 },


 navbarTap: function (e) {/**顶部导航栏 */
  this.setData({
   currentTab: e.currentTarget.dataset.idx
  })
 },

 showApplyMessage:function(){/** 显示申请加入球队消息*/
  const db=wx.cloud.database()
  const _ = db.command
  db.collection("delete_team_apply").get({ 
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     var k ="deleteList["+i+"]"
     this.setData({
      [k]: res.data[i].message_id
     })
    }
    db.collection("team_apply").where({ /**找出所有未处理过的球队申请 */
     leader_id: getApp().globalData.openid,
     _id:_.nin(this.data.deleteList)
      }).get({
     success: res => {
      this.setData({
       messageList: res.data
      })
     }
    })
   }
  })  
 },
 
 checkMessage:function(e){/**审核球队消息 */
  const db=wx.cloud.database()
  const _=db.command
  wx.showModal({
   title: '请审核',
   content: '是否同意该用户加入球队',
   cancelText: '不同意',
   confirmText: '同意',
   success: res => {
    db.collection("delete_team_apply").add({/**把这条消息加入已经处理过的集合 */
      data:{
       message_id:e.currentTarget.dataset.id
      }
    })
    if(res.confirm){/**如果点击同意 */
    db.collection("team_apply").where({_id:e.currentTarget.dataset.id}).get({
     success:res=>{
      db.collection("team_information").doc(res.data[0].team_id).update({/**球队num+1 */
       data:{
        team_num:_.inc(1)
       }
      })
      db.collection("join_team_list").add({/**成功加入球队 */
       data:{
        icon:res.data[0].icon,
        sex:res.data[0].sex,
        nickName:res.data[0].nick_name,
        team_id:res.data[0].team_id,
        player_id:res.data[0]._openid,
        team_logo_fileid:res.data[0].team_logo_fileid,
        team_name:res.data[0].team_name  
       }, 
       success:res=>{
          wx.showToast({
           title: '您已同意',
           icon: 'none'
          }) 
          this.showApplyMessage()    
       }      
      })
     }
    })
    }else{
     wx.showToast({
      title:'您已拒绝',
      icon:'none'
     })
     this.showApplyMessage()  
    }
   }
  })
 },

 showNotice:function(){/**显示消息列表--提示我参加的球队约球信息发生改变 */
  const db=wx.cloud.database()
  const _ = db.command
  db.collection("delete_team_notice").get({
   success: res => {
    for (var i = 0; i < res.data.length; i++) {
     var k = "deleteList_[" + i + "]"
     this.setData({
      [k]: res.data[i].notice_id
     })
    }
  db.collection("team_notice").where({ 
   warn_id:getApp().globalData.openid,
   _id:_.nin(this.data.deleteList_)
   }).get({
   success:res=>{
    this.setData({
     noticeList:res.data
    })
   }
  })  
   }
  })
 },
 
 showYueqiuMessage: function () {/** 显示活动消息*/
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("delete_yueqiu_notice").get({
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     var k="deleteList__["+i+"]"
     this.setData({
      [k]: res.data[i].notice_id
     })
    }
    db.collection("yueqiu_notice").where({ 
     warn_id: getApp().globalData.openid,
     _id: _.nin(this.data.deleteList__)
    }).get({
     success: res => {
      this.setData({
       yueqiuList: res.data
      })
     }
    })
   }
  })
 },

 deleteMessage:function(e){/**删除球队约球提醒消息 */
  const db=wx.cloud.database()
  db.collection("team_notice").where({_id:e.currentTarget.dataset.id}).get({
   success:res=>{
    if(res.data[0].type==1){/**自己发起的消息 */
     db.collection("team_notice").doc(res.data[0]._id).remove({
      success:res=>{
       this.showNotice()
       wx.showLoading({
        title: '删除中',
        mask: true
       })
       setTimeout(function () {
        wx.hideLoading()
       }, 2000)
      }
     })
    }else{/**别人发起的消息 */
     db.collection("delete_team_notice").add({
      data:{
       notice_id:e.currentTarget.dataset.id
      },
      success:res=>{
       this.showNotice()
       wx.showLoading({
        title: '删除中',
        mask: true
       })
       setTimeout(function () {
        wx.hideLoading()
       }, 2000)
      }
     })
    }
   }
  })
 },
 deleteMessage_:function(e){/**删除个人约球消息 */
  const db = wx.cloud.database()
  db.collection("yueqiu_notice").where({ _id: e.currentTarget.dataset.id }).get({
   success: res => {
    if (res.data[0].type == 1) {/**球队约球 即将开始消息 */
     db.collection("yueqiu_notice").doc(res.data[0]._id).remove({
      success: res => {
       this.showYueqiuMessage()
       wx.showLoading({
        title:'删除中',
        mask:true
       })
       setTimeout(function () {
        wx.hideLoading()
       }, 2000)
      }
     })
    } else {/**个人约球信息发生改变消息 */
     db.collection("delete_yueqiu_notice").add({
      data: {
       notice_id: e.currentTarget.dataset.id
      },
      success: res => {
       this.showYueqiuMessage()
       wx.showLoading({
        title: '删除中',
        mask: true
       })
       setTimeout(function () {
        wx.hideLoading()
       }, 2000)
      }
     })
    }
   }
  }) 
 },

 showPriMessage:function(){/**显示私信消息 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("rec_readed").where({_openid:getApp().globalData.openid}).get({/**得到我发送过消息的人的openid数组 */
   success:res=>{
     var j=0
     for(var i=0;i<res.data.length;i++){
      var k="chatList["+i+"]"
      this.setData({
       [k]:res.data[j].sendto_id
      })
      j++
     }
     db.collection("rec_readed").where({/**得到发给我消息>0，我发消息给他=0的人的openid数据 防止私信的人重复*/
      sendto_id:getApp().globalData.openid,
      _openid:_.nin(this.data.chatList)
      }).get({
      success:res_=>{
       var j = res.data.length
       for (var i=0;i<res_.data.length;i++){    
        var k="chatList["+j+"]"
        this.setData({
         [k]:res_.data[i]._openid
        })
        j++
       }
       for(let i=0;i<this.data.chatList.length;i++){                   
        db.collection("user_list").where({_openid:this.data.chatList[i]}).get({
         success:res=>{
          var k="iconList["+i+"]" 
          this.setData({
           [k]: res.data[0],
          })   
         }
        })      
       }  
      }
     })   
   }
  })
 },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
   wx.showLoading({
    title: '加载中',
    mask: true,
   })
   setTimeout(function () {
    wx.hideLoading()
   }, 2000)
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
    this.showApplyMessage()
    this.showNotice()
    this.showYueqiuMessage()
    this.showPriMessage()
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