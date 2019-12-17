Page({

  /** 
   * 页面的初始数据
   */
  data: {
   id:"" ,
   list:[],
   icon:"",
   team_id:"",
   flag:2,
   flag_:2,
   deleteList:[],
   teamList:[],
   teamIdList:[],
   index:"",
   opponent:"/images/vs.png",
   disabled:0,
   oppoTeamId:"",
   mark:0,
   over_:"" 
  },
  showDetail:function(){/**显示球队约球详情 */
   var that=this
   const db=wx.cloud.database()
   const _=db.command
   db.collection("team_pk_list").where({game_id:this.data.id}).get({/**判断该球队约球是否已经完成 */
    success:res=>{
     if(res.data.length==2){/**当两只球队匹配完成 */
      this.setData({
       oppoTeamId:res.data[1].team_id,
       mark:1
      })     
     db.collection("team_information").where({_id:res.data[1].team_id}).get({/**设定第二个队队标 */
      success:res=>{
       this.setData({
        opponent:res.data[0].team_logo_fileid
       })
      }
     })
      if (res.data[1]._openid == getApp().globalData.openid) {/**这个约球不是自己发起的,是我参加的 */
       this.setData({
        disabled: 1,
       })
      }
     }
    }
   })
   db.collection("yueqiu_team_information").where({_id:this.data.id}).get({/**显示该球队约球信息  */
    success:res=>{
     this.setData({
      list:res.data[0],
      team_id: res.data[0].my_team_id,
     })   
     db.collection("team_information").where({ _id: res.data[0].my_team_id }).get({/**左边队伍头像 */
      success: res => {
         this.setData({
          icon: res.data[0].team_logo_fileid
         })
      }
     })
     this.checkIfExitTeam()     
    },   
   })
  },

  checkIfExitTeam:function(){/**判断该用户与该球队的关系 */
   const db = wx.cloud.database()
   const _=db.command
   db.collection("exit_team_record").get({
    success:res=>{
     for (var i=0;i<res.data.length;i++) {/**检查是否已经退出球队 */
      var k="deleteList["+i+"]"
      this.setData({
       [k]:res.data[i].delete_id
      })
     }
     db.collection("join_team_list").where({
      _id: _.nin(this.data.deleteList),
      team_id:this.data.list.my_team_id,
      player_id: getApp().globalData.openid,
     }).get({
      success:res=>{
       if(res.data[0]._openid==getApp().globalData.openid){/**球队是我创建的 */
        this.setData({
         flag: 0
        })
       }
       else if(res.data[0]._openid!=getApp().globalData.openid){/**我是加入的 */
        this.setData({
         flag: 1
        })
       }
      },
     })

     db.collection("join_team_list").where({/**判断第二个球队与我的关系 */
      _id: _.nin(this.data.deleteList),
      team_id: this.data.oppoTeamId,
      player_id: getApp().globalData.openid,
     }).get({
      success: res => {
       if (res.data[0]._openid == getApp().globalData.openid) {
        this.setData({
         flag_: 0
        })
       }
       else if (res.data[0]._openid != getApp().globalData.openid) {
        this.setData({
         flag_: 1
        })
       }
      },
     })
    }
   })  
  },

 fight:function(){/**点击球队约球 */
  const db=wx.cloud.database()
  db.collection("team_pk_list").add({
   data:{
    game_id:this.data.id,
    team_id:this.data.teamIdList[this.data.index]
   },
   success: res => {
    wx.showToast({
     title: '约战成功',
    })
   }  
  })
  wx.navigateBack({
   
  })
  },

 lookLocation: function () {/**查看此约球的位置 */
  const db = wx.cloud.database()
  db.collection("yueqiu_team_information").where({ _id: this.data.id }).get({
   success: res => {
    wx.getLocation({
     type: 'wgs84',
     success(res_) {
      const latitude = res.data[0].team_latitude
      const longitude = res.data[0].team_longitude
      wx.openLocation({
       latitude,
       longitude,
       scale: 18
      })
     }
    })
   }
  })
 },

 chooseTeam:function(){/**点击左边头像选择球队 */
  var that=this 
  const db = wx.cloud.database()
  db.collection("yueqiu_team_information").where({_id:this.data.id}).get({
   success:res=>{
    if (res.data[0]._openid != getApp().globalData.openid) {/**当发起者是自己不可选择 */
     db.collection("team_information").where({ _openid: getApp().globalData.openid }).get({
      success: res => {
       for (var i = 0; i < res.data.length; i++) {
        var k = "teamList[" + i + "]"
        var x = "teamIdList[" + i + "]"
        this.setData({
         [k]: res.data[i].team_name,
         [x]: res.data[i]._id
        })
       }
       if(this.data.teamList.length>0){/**如果创建过球队 */
        wx.showActionSheet({
         itemList: this.data.teamList,
         itemColor: "#4B0082",
         success: function (res1) {
          that.setData({
           index: res1.tapIndex,
           opponent: res.data[res1.tapIndex].team_logo_fileid,
           disabled: 2,
          })
         },
         fail: function (res) {
         }
        })
       }else{
        wx.showToast({
         title: '您还没有球队，快去创建吧！',
         icon: 'none',
        })
       }
       
      }
     })
    }  
   }
  }) 
 },

 exit:function(){/**退出 */
  const db=wx.cloud.database()
  db.collection("team_pk_list").where({game_id:this.data.id}).get({
   success:res=>{
    db.collection("team_pk_list").doc(res.data[1]._id).remove({
     success:res=>{
      wx.showToast({
       title: '退出成功'
      })             
     }
    })    
    wx.navigateBack({
    }) 
   }
  })
 },
 
 to: function () {/**第一个球队跳转 */
  wx.navigateTo({
   url: '/pages/team_information/team_information?id=' + this.data.team_id + '&flag=' + this.data.flag
  })
 },
 look:function(){/**第二个球队跳转 */
  wx.navigateTo({
   url: '/pages/team_information/team_information?id='+this.data.oppoTeamId+'&flag='+this.data.flag_,
  })
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     id:options.id,
     over_:options.over_
    })
   this.showDetail()
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