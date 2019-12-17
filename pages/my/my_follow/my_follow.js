const app=getApp()
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
   list:[],
  },

  showMyFollow:function(){/**显示我关注的人 */
   const db=wx.cloud.database()
   db.collection("follow_record").where({_openid:app.globalData.openid}).get({
    success:res=>{
     var j=0
     for (var i = 0; i < res.data.length; i++) {
      db.collection("user_list").where({_openid:res.data[i].follow_id}).get({
      success:res=>{
       var k="list["+j+"]"
       this.setData({
        [k]:res.data[0]
       })
       j++
      }
     })        
     }
    }
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.showMyFollow()
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