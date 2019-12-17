/**2019.2.14 在这个页面,突然云储存里文件的fileid可以用来显示图片,而不必要去获取临时的http头图片*/
const app = getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: { 
   navbar: ['我创建的', '我加入的'],
   currentTab: 0,
   myFound:[],
   myJoin:[],
   deleteList:[]
  },

 navbarTap: function (e) {/**顶部导航栏 */
  this.setData({
   currentTab: e.currentTarget.dataset.idx
  })
 },

 foundTeam:function(){/**创建球队 */
  wx.navigateTo({
   url: '../my_team/found_team/found_team',
  })
 },

 showMyTeam:function(){/**显示我的球队*/
  var a=0,b=0
  const db=wx.cloud.database()
  const _ = db.command
  db.collection("exit_team_record").get({/**先确定是否有用户退出 有则那条记录不显示 */
   success: res => {
    for (var i = 0; i < res.data.length; i++) {
     var k = "deleteList[" + i + "]"
     this.setData({
      [k]: res.data[i].delete_id
     })
    }
    db.collection("join_team_list").where({ 
     player_id: this.data.openid,
     _id:_.nin(this.data.deleteList)
      }).get({
     success: res => {
      for (var i = 0; i < res.data.length; i++) {
       if (res.data[i]._openid == res.data[i].player_id) {/**如果是自己创建的 */
        var k = "myFound[" + a + "]"
        this.setData({
         [k]: res.data[i]
        })
        a++
       } else {/**如果是通过审核加入的 */
        var x = "myJoin[" + b + "]"
        this.setData({
         [x]: res.data[i],
        })
        b++
       }
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
   this.showMyTeam()
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