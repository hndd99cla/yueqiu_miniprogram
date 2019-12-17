Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    deleteList:[],
    flag:'',
  },

  toTeam:function(e){/**点击球队跳转 判断用户与球队的关系*/
   const db=wx.cloud.database()
   const _=db.command
   db.collection("exit_team_record").get({
    success:res=>{
     for(var i=0;i<res.data.length;i++){
      var k="deleteList["+i+"]"
      this.setData({
       [k]:res.data[i].delete_id
      })
     }
     db.collection("join_team_list").where({
      _id:_.nin(this.data.deleteList),
      player_id:getApp().globalData.openid,
      team_id:e.currentTarget.dataset.id
     }).get({
      success:res=>{
       if(res.data.length==1){/**我是这个球队的成员 */
        if(res.data[0]._openid==res.data[0].player_id){/**我是球队发起者 */
          this.setData({
           flag:0
          })
        }else{/**我是球队成员 */
          this.setData({
           flag:1
          })
        }
       }else{/**我还未加入该球队 */
         this.setData({
          flag:2
         })
       }
       wx.navigateTo({
        url: '/pages/team_information/team_information?id=' + e.currentTarget.dataset.id + '&flag=' + this.data.flag,
       })
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
     type:options.type,/**判断是 显示球员还是球队 */
     list:JSON.parse(options.list)
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