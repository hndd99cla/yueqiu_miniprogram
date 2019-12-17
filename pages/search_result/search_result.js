const app=getApp();
var util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
   searchList:[],
   searchList_:[],
   fullList:[]
  },
 showDay: function (array) {/**显示距离剩多少天  */
  for (var i = 0; i < array.length; i++) {
   var k = 'dayList[' + i + ']'
   this.setData({
    [k]: ((array[i].i_date_num - app.globalData.now_num) / 86400000).toFixed(0)
   })
  }
 },
 showTeamDay: function (array) {/**显示球队距离剩多少天  */
  for (var i = 0; i < array.length; i++) {
   var k = 'day1List[' + i + ']'
   this.setData({
    [k]: ((array[i].team_date_num - app.globalData.now_num) / 86400000).toFixed(0)
   })
  }
 },

 showNum:function() {/**显示个人约球已有多少人加入*/
  const db=wx.cloud.database()
  var j=0;
  var v=0;
  for (var i in this.data.searchList) {/**人满则显示已满 */
   db.collection("yueqiu_information").where({ _id: this.data.searchList[i]._id }).get({
    success: res => {
     var k = "fullList[" + v + "]"
     this.setData({
      [k]: res.data[0].i_num
     })
     v++
    }
   }) 
  }
  for(var i in this.data.searchList) {
   db.collection("join_list").where({ yueqiu_id:this.data.searchList[i]._id }).count({
    success:res=>{
     var k="numList["+j+"]"
     if(this.data.fullList[j]==res.total){
      this.setData({
       [k]:'人数已满'
      })
     }else{
      this.setData({
       [k]:'已有'+res.total+'人加入'
      })
     }  
     j++ 
    }
   }) 
  }
 },
 showStatus:function(){/**显示球队约球的状态 */
   const db=wx.cloud.database()
   var j=0
   for(var i in this.data.searchList_){
    db.collection("team_pk_list").where({ game_id:this.data.searchList_[i]._id}).get({
     success:res=>{
      var k="statusList["+j+"]"
      if(res.data.length==2){
       this.setData({
        [k]:'匹配成功'
       })
      }else{
       this.setData({
        [k]:'等待对手中'
       })
      }
      j++
     }
    })
   }
 },

 getDis:function(){/**获得用户与约球地点的距离 */
  for(var i=0;i<this.data.searchList.length;i++){
   var k='myDis['+i+']'
   this.setData({
    [k]: util.distance(getApp().globalData.latitude, getApp().globalData.longitude,this.data.searchList[i].i_latitude, this.data.searchList[i].i_longitude)
   })
  }
 },
 getTeamDis:function(){/**获得约球球队与球队约球地点的距离 */
  for(var i=0;i<this.data.searchList_.length;i++){
   var k='myTeamDis['+i+']'
   this.setData({
    [k]: util.distance(getApp().globalData.latitude, getApp().globalData.longitude, this.data.searchList_[i].team_latitude,this.data.searchList_[i].team_longitude)
   })
  }
 },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     searchList: JSON.parse(options.searchList),
     searchList_: JSON.parse(options.searchList_),
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
    this.showDay(this.data.searchList)
    this.showTeamDay(this.data.searchList_)
    this.showNum()
    this.getDis()
    this.getTeamDis()
    this.showStatus()
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