const app=getApp()
Page({ 
  /** 
   * 页面的初始数据
   */ 
  data: {
   navbar: ['个人约球', '球队约球'],
   currentTab: 0, 
   openid:'',
   yueqiuList:[],
   yueqiuList_: [],
   yueqiuTeamList:[],
   yueqiuTeamList_:[],
   editList:[],
   editTeamList:[],
   deleteList:[],
   deleteList_:[],
  },
  

 navbarTap: function (e) {/**顶部导航栏 */
  this.setData({
   currentTab: e.currentTarget.dataset.idx
  })
 },


showMyYueqiu:function(){/**显示我所有加入的约球 */
 this.setData({
  yueqiuList:[],
  yueqiuList_:[]
 })
  const db=wx.cloud.database()
  const _=db.command
  db.collection("delete_join_list").get({
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     var k="deleteList["+i+"]"
     this.setData({
      [k]:res.data[i].join_list_id
     })
    }
    db.collection("join_list").where({
     _openid: this.data.openid,
     _id: _.nin(this.data.deleteList)
    }).get({
     success: res => {
      var a = 0, b = 0
      for (var i = 0; i < res.data.length; i++) {
       db.collection("yueqiu_information").where({ _id: res.data[i].yueqiu_id }).get({
        success: res => {
         if (res.data[0].i_date_num > getApp().globalData.now_num) {/**未开始的 */
          var k = "yueqiuList[" + a + "]"
          var l_ = "editList[" + a + "]"
          if (res.data[0]._openid == app.globalData.openid) {/**如果是自己发起的  则有编辑按钮 */
           this.setData({
            [l_]: true
           })
          } else {
           this.setData({
            [l_]: false
           })
          }
          this.setData({
           [k]: res.data[0]
          })
          a++
         } else {/**已经结束 */
          var k = "yueqiuList_[" + b + "]"
          this.setData({
           [k]: res.data[0]
          })
          b++
         }
        }
       })
      }
     }
    })
   }
  })
  
 },

showMyTeamYueqiu:function(){/**显示球队约球 */
 this.setData({
  yueqiuTeamList:[],
  yueqiuTeamList_:[]
 })
  const db = wx.cloud.database()
  const _=db.command
  db.collection("delete_team_pk_list").get({
   success:res=>{
    for (var i = 0; i < res.data.length; i++) {
     var k = "deleteList_[" + i + "]"
     this.setData({
      [k]: res.data[i].team_pk_list_id
     })
    } 
    db.collection("team_pk_list").where({
      _openid: this.data.openid, 
      _id:_.nin(this.data.deleteList_)
      }).get({
     success: res => {
      var a = 0, b = 0
      for (var i = 0; i < res.data.length; i++) {
       db.collection("yueqiu_team_information").where({ _id: res.data[i].game_id }).get({
        success: res => {
         if (res.data[0].team_date_num > getApp().globalData.now_num) {/**未开始的 */
          var k = "yueqiuTeamList[" + a + "]"
          var l_ = "editTeamList[" + a + "]"
          if (res.data[0]._openid == app.globalData.openid) {/**如果是自己发起的 */
           this.setData({
            [l_]: true
           })
          } else {
           this.setData({
            [l_]: false
           })
          }
          this.setData({
           [k]: res.data[0]
          })
          a++
         } else {/**已经结束 */
          var k = "yueqiuTeamList_[" + b + "]"
          this.setData({
           [k]: res.data[0]
          })
          b++
         }
        }
       })
      }
     }
    })

   }
  })
  
},

 delRec:function(e){/**删除已结束约球的记录 */
  const db=wx.cloud.database()
  wx.showModal({
   title: '确定删除此记录？',
   content: '删除的内容无法再恢复',
   success:res=>{
    if(res.confirm){/**如果同意删除 */
     db.collection("join_list").where({
      _openid:getApp().globalData.openid,
      yueqiu_id:e.currentTarget.dataset.id
     }).get({
      success:res=>{
       db.collection("delete_join_list").add({/**不在join_list删除是因为如果自己删除了  别人还能看到这个约球你参加过 也能不因为你的删除而进行评分*/
        data:{
         join_list_id:res.data[0]._id
        },
        success:res=>{
         this.onShow()
        }
       })
      }
     })     
    }else{

    }
   }
  })
 },
 delRec_: function (e) {/**删除已结束的球队约球的记录 */
  const db = wx.cloud.database()
  wx.showModal({
   title: '确定删除此记录？',
   content: '删除的内容无法再恢复',
   success: res => {
    if (res.confirm) {
     db.collection("team_pk_list").where({
      _openid: getApp().globalData.openid,
      game_id: e.currentTarget.dataset.id
     }).get({
      success: res => {
       db.collection("delete_team_pk_list").add({
        data: {
         team_pk_list_id: res.data[0]._id
        },
        success: res => {
         this.onShow()
        }
       })
      }
     })
    } else {

    }
   }
  })
 },

  /**
   * 生命周期函数--监听页面加载
   */
 onLoad: function (options) {
  this.setData({
   openid: app.globalData.openid
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
   this.showMyYueqiu()
   this.showMyTeamYueqiu()
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