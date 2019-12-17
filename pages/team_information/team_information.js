Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    id:"",
    num:"",/**集合delete_team_record里有几个退出 */
    flag:"",/**判断是从那个页面进入这个页面的 */
    memberList:[],
    modal1:true,
    modal2: true,
    newName:"",
    newExplain:"",
    mark:[],/**判断有没有关注过 */
    deleteList:[],
    list:[]
  },

  showTeamDetail:function(){/**显示球队详情 */
   var that=this
   const db=wx.cloud.database()
   db.collection("exit_team_record").where({ exit_team:this.data.id}).count({
    success:res=>{
     this.setData({
      num:res.total
     })
     db.collection("team_information").where({ _id: this.data.id }).get({/**球队信息 */
      success: res => {
       this.setData({
        list:res.data[0],
        teamNum: res.data[0].team_num-this.data.num,
       })
      }
     })

    }
   })  
   this.showMemberList()
  },
  showMemberList:function(){/**显示成员列表 */
   const db=wx.cloud.database()
   const _=db.command
   db.collection("exit_team_record").get({
    success:res=>{
     for (var i = 0; i < res.data.length; i++) {
      var k = "deleteList[" + i + "]"
      this.setData({
       [k]: res.data[i].delete_id
      })      
     }
     db.collection("join_team_list").where({ 
      team_id: this.data.id,
      _id:_.nin(this.data.deleteList)
       }).get({
      success: res => {
       this.setData({
        memberList: res.data,
       })
       var x = 0
       for (var i in res.data) {
        db.collection("follow_record").where({
         _openid: this.data.openid,
         follow_id: res.data[i].player_id
        }).get({
         success: res => {
          var k = "mark[" + x + "]"
          if (res.data.length > 0) {/**如果我对这个队员有关注 */
           this.setData({
            [k]: true
           })         
          } else {
           this.setData({
            [k]: false
           })         
          }
          x++
         }
        })
       }
      }
     })
    }
   }) 
  },

  join:function(){/**申请加入该球队 首先要发送验证消息给该球队队长*/
  const db=wx.cloud.database()
  db.collection("team_apply").add({
   data:{
    team_id:this.data.id,
    leader_id:this.data.list._openid, 
    nick_name:getApp().globalData.nickName,
    team_name: this.data.list.team_name,
    sex:getApp().globalData.sex,
    icon:getApp().globalData.avatarUrl,
    team_logo_fileid: this.data.list.team_logo_fileid
   },
   success:res=>{
    wx.showToast({
     title: '已申请',
    })   
   }
  })
   wx.navigateBack({
   })
  },
 
  manageTeam:function(){
   this.setData({
    flag:3
   })
   this.onShow()
  },

  modal1:function(){/**修改球队名字 */
    this.setData({
     modal1:!this.data.modal1
    })
  },
 modal2: function () {/**修改球队简介 */
  this.setData({
   modal2: !this.data.modal2
  })
 },
 cancel1:function(){
   this.setData({
    modal1:true
   })
  },
 cancel2: function () {
  this.setData({
   modal2: true
  })
 },
  confirm1: function () {
   this.setData({
    modal1: true,
    'list.team_name':this.data.newName 
  })
 },
 confirm2: function () {
  this.setData({
   modal2: true,
   'list.team_explain':this.data.newExplain
  })
 },
 setTeamName:function(e){
  this.setData({
   newName:e.detail.value
  })
 },
 setExplain: function (e) {
  this.setData({
   newExplain: e.detail.value
  })
 },
 delMember:function(e){/**删除成员 */
  const db=wx.cloud.database()
  const _=db.command
  wx.showModal({
   title: '请确认',
   content: '是否踢出此用户',
   cancelText: '再想想',
   confirmText: '踢出',
   success:res=>{
    if(res.confirm){
     db.collection("join_team_list").where({
      team_id: e.currentTarget.dataset.teamid,
      player_id:e.currentTarget.dataset.id,
     }).get({
      success:res=>{
       db.collection("join_team_list").doc(res.data[res.data.length-1]._id).remove({/**删除信息 */
        success:res=>{
         wx.showToast({
          title: '踢出成功',
         })
         db.collection("team_information").doc(this.data.id).update({/**球队人数减1 */
          data:{
           team_num:_.inc(-1)
          }
         })
         this.showMemberList()
        }
       })     
      }
     })
    }else{     
    }
   }
  })
 },

 save:function(){/**保存修改 */
  const db=wx.cloud.database()
  db.collection("team_information").doc(this.data.id).update({
   data:{
    team_name:this.data.list.team_name,
    team_explain: this.data.list.team_explain
   },
   success:res=>{
    db.collection("join_team_list").where({ team_id: this.data.id }).get({/**更新此集合里球队名字 */
     success: res => {
      for (var i = 0; i < res.data.length; i++) {   
       db.collection("join_team_list").doc(res.data[i]._id).update({
        data:{
         team_name:this.data.list.team_name
        },
       })
      }
     }
    })
    db.collection("join_match_list").where({ team_id: this.data.id }).get({/**更新此集合里球队名字 */
     success: res => {
      for (var i = 0; i < res.data.length; i++) {
       db.collection("join_match_list").doc(res.data[i]._id).update({
        data: {
         team_name: this.data.list.team_name
        },
       })
      }
     }
    })
    this.setData({
     flag:0
    })
    wx.showToast({
     title: '保存成功',
    })
    this.onShow()
   }
  })
 },

 exit:function(){/**退出球队 */
  const db=wx.cloud.database()
  wx.showModal({
   title: '请确认',
   content: '是否退出球队',
   cancelText: '再想想',
   confirmText: '退出',
   success:res=>{
    if(res.confirm){
     db.collection("join_team_list").where({
      player_id: this.data.openid,
      team_id: this.data.id
     }).get({
      success:res=>{
       db.collection("exit_team_record").add({/**添加集合的最后一条 因为前面已经是退出过的 */
        data: {
         delete_id:res.data[res.data.length-1]._id,
         exit_team: res.data[res.data.length-1].team_id
        },
        success:res=>{
         wx.showToast({
          title: '退出成功'
         })    
         wx.navigateBack({
          delta: 2
         })    
        }
       })      
      }
     })   
    }else{

    }
   }
  })
 },

  follow:function(e){/**加入关注名单 */
   const db=wx.cloud.database()
   db.collection("follow_record").add({
    data:{
     follow_id: e.currentTarget.dataset.id
    },
    success:res=>{
     this.onShow()
    }
   })  
  },
  cancelFollow:function(e){/**取消关注 */
   const db=wx.cloud.database()
   db.collection("follow_record").where({
    _openid:this.data.openid,
    follow_id:e.currentTarget.dataset.id
   }).get({
    success: res => {
     db.collection("follow_record").doc(res.data[0]._id).remove({
      success:res=>{
       this.onShow()
      }
     })
    }
   })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
    id: options.id,/**球队id */
    flag:options.flag,
    openid:getApp().globalData.openid
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
    this.showTeamDetail()
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