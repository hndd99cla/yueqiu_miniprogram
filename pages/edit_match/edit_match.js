Page({

 /**
  * 页面的初始数据
  */
 data: {
  fileID: "",
 },

 showDetail:function(){/**显示原本数据 */
  const db=wx.cloud.database()
  db.collection("match_list").where({_id:this.data.id}).get({
   success:res=>{
    this.setData({
     matchList: res.data[0],
     fileID:res.data[0].match_post
    })
   }
  })
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

 uploadPost: function () {
  var postName = this.random()
  var that = this
  var k="matchList.match_post"
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
     [k]: filePath,
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
 var k="matchList.match_location"
  const this_ = this/**避免回调函数里面不能用this.setData */
  wx.chooseLocation({
   success: function (res) {
    this_.setData({
     [k]: res.name,
    })
   },
  })
 },
 changeDate: function (e) {/**设置日期 */
 var k="matchList.match_date"
  this.setData({
   [k]: e.detail.value
  })
 },

 changeDate_: function (e) {/**设置时间 */
  var k = "matchList.match_overdate"
  this.setData({
   [k]: e.detail.value
  })
 },

 bindSave: function (e) {/**保存修改 */
  const db = wx.cloud.database()
  db.collection('match_list').doc(this.data.id).update({
   data: {
    match_post: this.data.fileID,
    match_name: e.detail.value.matchName,
    match_location: e.detail.value.setLocation,
    match_date: e.detail.value.startDate,
    match_date_num:new Number(new Date(e.detail.value.startDate)),
    match_overdate: e.detail.value.overDate,
    match_unit: e.detail.value.matchUnit,
    match_phone: e.detail.value.matchPhone,
    match_explain: e.detail.value.matchExplain,
   },
   success: res => {
    wx.showToast({
     icon:"none",
     title: '保存成功',
    })
   },
   fail: err => {
    wx.showToast({
     icon: 'none',
    })
   }
  })
 },



 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  this.setData({
   id:options.id,
   now:getApp().globalData.now
  })
  this.showDetail()/**防止刷新 */
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