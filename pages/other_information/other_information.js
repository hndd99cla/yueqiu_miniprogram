Page({
 
  /**
   * 页面的初始数据
   */
  data: {
   navbar: ['TA的信息', 'TA的球队'],
   currentTab: 0,
   openid:'',
   userList:[],
   list:[],
   teamList:[],
   flag:[],
   deleteList:[],
   evaList:[],
   mark:2,
   priMess:true
  },
 navbarTap: function (e) {/**顶部导航栏 */
  this.setData({
   currentTab: e.currentTarget.dataset.idx
  })
 },

 showNickname:function(){/**显示头像  用user_list的头像为了防止用户没有进入我的信息页面保存信息 */
   const db=wx.cloud.database()
   db.collection("user_list").where({_openid:this.data.openid}).get({
    success:res=>{
     this.setData({
      userList:res.data[0]
     })
    }
   })
 },

 getInformation:function(){/**显示其他人的信息 */
   const db=wx.cloud.database()
   db.collection("my_information").where({_openid:this.data.openid}).get({
    success:res=>{
     this.setData({
      list:res.data[0]
     })
    }
   })
  if (getApp().globalData.openid==this.data.openid){/**如果是自己不用显示关注按钮 */
   this.setData({
    mark: 0
   })
  } else {
   db.collection("follow_record").where({
    _openid: getApp().globalData.openid,
    follow_id: this.data.openid
   }).get({
    success: res => {
     if (res.data.length==1){/**已经关注 */
      this.setData({
       mark: 1
      })
     } else {
     }
    }
   })
  }
  if(this.data.openid==getApp().globalData.openid){/**是否显示私信图标 */
   this.setData({
    priMess:false
   })
  }
 },

 showTaTeam:function(){/**显示他的球队 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("exit_team_record").get({/**先确定是否有用户退出 有则那条记录不显示 */
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     var k="deleteList["+i+"]"
     this.setData({
      [k]:res.data[i].delete_id
     })
    }
    db.collection("join_team_list").where({ /**设置传递的flag参数 显示加入的球队*/
     player_id: this.data.openid,
     _id: _.nin(this.data.deleteList)
    }).get({
     success:res=>{
      var j=0
      this.setData({
       teamList:res.data
      })
      for(var i=0;i<res.data.length;i++){
       db.collection("join_team_list").where({
        _id:_.nin(this.data.deleteList),
        team_id:res.data[i].team_id,
        player_id:getApp().globalData.openid
       }).get({
        success:res=>{
         var k__="flag["+j+"]"
         if(res.data.length==1){
          if(res.data[0]._openid==res.data[0].player_id){
           this.setData({
            [k__]: 0
           })
          }else{
           this.setData({
            [k__]: 1
           })
          }
          j++
         }else{
          this.setData({
           [k__]: 2
          })
          j++
         }
        }
       })
      }
     }
    })
   }
  })   
    
 },

 follow:function(){/**关注 */
  const db=wx.cloud.database()
  db.collection("follow_record").add({
   data:{
    follow_id:this.data.openid
   },
   success:res=>{
    this.setData({
     mark:1
    })
   }
  })
 },
 cancelFollow:function(){/**取消关注 */
  const db=wx.cloud.database()
  db.collection("follow_record").where({
   follow_id:this.data.openid,
   _openid:getApp().globalData.openid
  }).get({
   success:res=>{
    db.collection("follow_record").doc(res.data[0]._id).remove({
     success:res=>{
      this.setData({
       mark:2
      })
     }
    })
   }
  })
 },

 sendMessage:function(){
  wx.navigateTo({
   url: '/pages/send_private_message/send_private_message?openid=' + this.data.openid + '&nickName=' + this.data.userList.nickName,
  })
 },
 
 showComment:function(){/**显示评价和评分 */
  const db=wx.cloud.database()
  db.collection("evaluate_list").where({eva_user:this.data.openid}).get({
   success:res=>{
    this.setData({
     evaList:res.data
    })
   }
  })
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
   this.setData({
    openid: options.openid
   })
   wx.showLoading({
    title: '加载中',
    mask: true,
   })
   this.showNickname()
   this.showTaTeam()
   this.showComment()
   this.getInformation() 
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