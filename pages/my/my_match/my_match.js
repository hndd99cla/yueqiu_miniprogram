Page({

  /**
   * 页面的初始数据
   */
  data: { 
   navbar: ['我参加的', '我创建的'],
   currentTab:0,
   deleteList:[], 
  },

 navbarTap: function (e) {/**顶部导航栏 */
  this.setData({
   currentTab: e.currentTarget.dataset.idx
  })
 },

 foundMatch:function(){
  wx.navigateTo({
   url: '/pages/my/my_match/found_match/found_match',
  })
 },

 showMyJoin:function(){/**显示我参加的 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("delete_match_list").get({
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     var k="deleteList["+i+"]"
     this.setData({
      [k]:res.data[i].join_match_id
     })
    }
    db.collection("join_match_list").where({
      _openid: getApp().globalData.openid,
      _id:_.nin(this.data.deleteList) 
      }).get({
     success: res => {
      var j=0
      for(var i=0;i<res.data.length;i++){
       db.collection("match_list").where({ _id: res.data[i].match_id }).get({
        success: res => {
         var k = "joinList[" + j + "]"
         this.setData({
          [k]:res.data
         })
         j++
        }
       })    
      }
     }
    })
   }
  }) 
 },

 showMyFound:function(){/**显示我创建的 */
  const db=wx.cloud.database()
  db.collection("match_list").where({_openid:getApp().globalData.openid}).get({
   success:res=>{
    this.setData({
     matchList:res.data
    })
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
    this.showMyFound()
    this.showMyJoin()
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