Page({

  /**
   * 页面的初始数据
   */
  data: {
    mark:true,
    post:"",
    fileID:"",
  },

 random: function () {/**随机产生十位数文件名 */
  var sb = "";
  var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < 10; i++) {
   var number = Math.round(Math.random() * 62);
   sb += (str.charAt(number) + "");
  }
  return sb;
 },

  uploadPost:function(){
   var postName = this.random()
   var that = this
   // 选择图片 
   wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],/**压缩图 */
    sourceType: ['album', 'camera'],
    success: function (res) {
     wx.showLoading({
      title: '上传中',
     })
     const filePath = res.tempFilePaths[0]
     that.setData({/**显示选择的头像 */
      post: filePath,
      mark:false
     })
     // 上传图片到云存储
     const cloudPath = "match_post/" + postName + ".png"
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

 selectLocation: function () {/**设置位置 */
  const this_ = this
  wx.getSetting({
   success: (res) => {
    if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
     //未授权
     wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      success: function (res) {
       if (res.cancel) {
        //取消授权
        wx.showToast({
         title: '拒绝授权',
         icon: 'none',
         duration: 1000
        })
       } else if (res.confirm) {
        //确定授权，通过wx.openSetting发起授权请求
        wx.openSetting({
         success: function (res) {
          if (res.authSetting["scope.userLocation"] == true) {
           wx.showToast({
            title: '授权成功',
            icon: 'success',
            duration: 1000
           })
          } else {
           wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1000
           })
          }
         }
        })
       }
      }
     })
    } else if (res.authSetting['scope.userLocation'] == undefined) {
    }
    else {
    }
   }
  })
  wx.chooseLocation({
   success: function (res) {
    this_.setData({
     mylocation: res.name,
    })
   },
  })
 },
 changeDate: function (e) {/**设置日期 */
  this.setData({
   date:e.detail.value
  })
 },

 changeDate_: function (e) {/**设置时间 */
  this.setData({
   date_:e.detail.value
  })
 },

 bindSubmit:function(e){/**创建赛事 */
  const db = wx.cloud.database()
  db.collection('match_list').add({
   data: {
    match_post:this.data.fileID,
    match_name: e.detail.value.matchName,
    match_location: e.detail.value.setLocation,
    match_date: e.detail.value.startDate,
    match_date_num: new Number(new Date(e.detail.value.startDate)),
    match_overdate: e.detail.value.overDate,
    match_unit: e.detail.value.matchUnit,
    match_phone: e.detail.value.matchPhone,
    match_explain: e.detail.value.matchExplain,
    audit:false,
    schedule:new Array(),
    results:new Array(),
    sroce_rank:new Array()
   },
   success: res => {
    wx.showToast({
     title: '已提交审核',
    })
   },
   fail: err => {
    wx.showToast({
     icon: 'none',
    })
   }
  })
  wx.navigateBack({
   
  })
 },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     now:getApp().globalData.now
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