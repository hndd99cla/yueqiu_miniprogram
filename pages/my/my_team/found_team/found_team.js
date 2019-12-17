Page({

  /**
   * 页面的初始数据
   */
  data: {
   image:"", 
  },

  random:function(){/**随机产生十位数文件名 */
  var sb="";
  var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 10; i++){
  var number = Math.round(Math.random()*62);
  sb+=(str.charAt(number)+"");
}
   return sb;
  },

 // 上传图片
 doUpload: function () {
  var imageName = this.random()
  var that=this
  // 选择图片 
  wx.chooseImage({
   count: 1,
   sizeType: ['compressed'],
   sourceType: ['album', 'camera'],
   success: function (res) {
    wx.showLoading({
     title: '上传中',
    })
    const filePath = res.tempFilePaths[0]
    that.setData({/**显示选择的头像 */
     image:filePath
    })
    // 上传图片到云存储
    const cloudPath = "team_images/"+imageName+".png"
    wx.cloud.uploadFile({
     cloudPath,
     filePath,
     success: res => {
      that.setData({
       fileID: res.fileID
      })
     },
     fail: e => {
      console.error('[上传文件] 失败：', e)
      wx.showToast({
       icon: 'none',
       title: '上传失败',
      })
     },
     complete: () => {
      wx.hideLoading()
     }
    })
   },
   fail: e => {
    console.error(e)
   }
  })
 },

 found:function(e){/**新建球队 */
  const db=wx.cloud.database()
  if(this.data.fileID!=null&e.detail.value.teamName!=null&e.detail.value.teamExplain!=null){/**如果填写完整 */
   db.collection("team_information").add({
    data: {
     team_name: e.detail.value.teamName,
     team_explain: e.detail.value.teamExplain,
     team_num: new Number(1),
     team_logo_fileid: this.data.fileID,
    },
    success: res => {
     db.collection("join_team_list").add({/**新建球队的人自动加入球队*/
      data: {
       team_id: res._id,
       icon: this.data.icon,
       sex: this.data.sex,
       nickName: this.data.nickName,
       player_id: getApp().globalData.openid,
       team_logo_fileid: this.data.fileID,
       team_name: e.detail.value.teamName
      },
      success: res => {
       wx.showToast({
        title: '创建成功',
       })
      }
     })
     wx.navigateBack({
     })
    }
   })
  }else{
   wx.showToast({
    title: '请把信息填写完整',
    icon:'none'
   })
  }
 },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     icon: getApp().globalData.avatarUrl,
     sex: getApp().globalData.sex,
     nickName:getApp().globalData.nickName
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