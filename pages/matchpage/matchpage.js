  
Page({

 /**
  * 页面的初始数据
  */
 data: {
  matchList:[],
  statusList:[]
 },

 showMatch:function(){/**显示赛事 */
  const db=wx.cloud.database()
  db.collection("match_list").get({
   success:res=>{
    for(var i=0;i<res.data.length;i++){
     var k="statusList["+i+"]"
     if(res.data[i].match_date_num>getApp().globalData.now_num){/**如果赛事开始时间还没到 */
      this.setData({
       [k]:'报名中'
      })
     }else{
      this.setData({
       [k]:'报名结束'
      })
     }
    }
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
  this.showMatch()
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