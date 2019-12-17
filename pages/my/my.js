const app = getApp();
Page({
  data: {
   avatarUrl: "",
   nickName: "" 
  },
 
 toMyinformation: function () { 
    wx.navigateTo({
     url: '../my/my_yueqiu/my_yueqiu',
    })
 },

 toMyteam:function(){
  wx.navigateTo({
   url: '../my/my_team/my_team',
  })
 },
 toMyFollow:function(){
  wx.navigateTo({
   url: '../my/my_follow/my_follow',
  })
 },
 toMyMatch:function(){
  wx.navigateTo({
   url: '../my/my_match/my_match',
  })
 },

  showFans:function(){/**显示粉丝数 */
    const db=wx.cloud.database()
   db.collection("follow_record").where({ follow_id:getApp().globalData.openid}).get({
    success:res=>{
     this.setData({
      fans:res.data.length
     })
    }
   })
  },
  showFollow:function(){/**显示关注数 */
    const db=wx.cloud.database()
    db.collection("follow_record").where({_openid:getApp().globalData.openid}).get({
     success:res=>{
      this.setData({
       follow:res.data.length
      })
     }
    })
  },
  
  daiding:function(){
   wx.showToast({
    title: '暂未开放',
    icon:'none'
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.showFans()
   this.showFollow()
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
   // 获取用户信息
   app.checkUser()
   this.setData({
    avatarUrl: app.globalData.avatarUrl,
    nickName: app.globalData.nickName,
    city:app.globalData.city
   })
   wx.hideTabBarRedDot({/**点击隐藏红点 */
    index: 3,
   }) 
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
   this.onShow()
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