Page({

 /**
  * 页面的初始数据
  */
 data: {
  cateItems: [
   {
    cate_id: 1,
    cate_name: "参赛球队",
   },
   {
    cate_id: 2,
    cate_name: "赛程查看",
   },
   {
    cate_id: 3,
    cate_name: "数据统计"
   },
   {
    cate_id: 4,
    cate_name: "其他信息",
   }
  ],
  curNav: 1,
  dateList: [],
  numList: [],
  score: true,
  selectedFlag: [false, false, false, false, false],
  deleteList: []
 },

 switchRightTab: function (e) {
  // 获取item项的id，和数组的下标值  
  let id = e.target.dataset.id
  this.setData({
   curNav: id,
  })
 },

 changeToggle: function (e) {/**球员数据下拉框 */
  var index = e.currentTarget.dataset.index;
  if (this.data.selectedFlag[index]) {
   this.data.selectedFlag[index] = false;
  } else {
   this.data.selectedFlag[index] = true;
  }
  this.setData({
   selectedFlag: this.data.selectedFlag
  })
 },

 showJoinTeam: function () {/**显示参赛的球队 */
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("delete_match_list").where({ match_id: this.data.id }).get({
   success: res => {
    for (var i = 0; i < res.data.length; i++) {
     var k = "deleteList[" + i + "]"
     this.setData({
      [k]: res.data[i].join_match_id
     })
    }
    db.collection("join_match_list").where({
     match_id: this.data.id,
     _id: _.nin(this.data.deleteList)
    }).get({
     success: res => {
      this.setData({
       teamList: res.data
      })
     }
    })
   }
  })
 },
 

 showSchedule: function () {/**显示赛程 */
  const db = wx.cloud.database()
  db.collection("match_list").where({ _id: this.data.id }).get({
   success: res => {
    for (var i = 0; i < res.data[0].schedule.length; i++) {/**显示赛程查看里的每天比赛场数 */
     var k = "numList[" + i + "]"
     this.setData({
      [k]: (res.data[0].schedule[i].length - 1)
     })
    }
    for (var i = 0; i < res.data[0].results.length; i++) {/**显示数据统计里每组的球队数 */
     var k = "numList_[" + i + "]"
     this.setData({
      [k]: (res.data[0].results[i].length - 1)
     })
    } 
    this.setData({
     dateList: res.data[0].schedule,
     groupList: res.data[0].results,
     scoreList: res.data[0].score_rank
    })
   }
  })
 },


 
 
 


 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {
  this.setData({
   id: options.id
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
  this.showJoinTeam()
  this.showSchedule()
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