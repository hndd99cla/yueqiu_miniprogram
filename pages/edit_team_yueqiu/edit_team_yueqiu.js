Page({
 
  /**
   * 页面的初始数据
   */
  data: {
   id:"",
   list:[],
   teamName:"",
   teamList:[],
   teamIdList:[],
   typeList:['半场', '全场'],
   endDate:'2020-12-31'
  },

  showOrigin:function(){/**显示详情 */
   const db=wx.cloud.database()
   db.collection("yueqiu_team_information").where({ _id: this.data.id}).get({
    success: res => {
     this.setData({
      list: res.data[0]
     })
     db.collection("team_information").where({_id:res.data[0].my_team_id}).get({
      success:res=>{
       this.setData({
        teamName:res.data[0].team_name
       })
      }
     })
    }
   })
  },

 selectType: function () {
  var that = this
  var k="list.game_type"
  wx.showActionSheet({
   itemList:this.data.typeList,
   success:function(res){
    that.setData({
     [k]:that.data.typeList[res.tapIndex]
    })
   },
   fail: function (res) {
   }
  })
 },

 selectLocation:function(){
  var that = this
  var k = "list.team_location"
  var k_ = "list.team_latitude"
  var k__ = "list.team_longitude"
  wx.chooseLocation({
   success: function (res) {
    that.setData({
     [k]: res.name,
     [k_]: res.latitude,
     [k__]: res.longitude
    })
   },
  })
 },
 changeDate: function (e) {/**设置日期 */
  var k = "list.team_date"
  this.setData({
   [k]: e.detail.value
  })
 },
 changeTime: function (e) {/**设置时间 */
  var k = "list.team_time"
  this.setData({
   [k]: e.detail.value
  })
 },
 bindSave: function (e) {/**保存修改 */
  const db = wx.cloud.database()
  db.collection("yueqiu_team_information").doc(this.data.id).update({
   data: {
    game_type:e.detail.value.setType,
    team_location: e.detail.value.setLocation,
    team_latitude:this.data.list.team_latitude,
    team_longitude:this.data.list.team_longitude,
    team_date:e.detail.value.setDate,
    team_date_num: new Number(new Date(e.detail.value.setDate)),
    team_time:e.detail.value.setTime,
    team_explain:e.detail.value.setExplain
   },
   success: res => {
    db.collection("team_pk_list").where({game_id:this.data.id}).get({/**当需要改变约球的某项时，会通知给你的约球对手 */
     success:res=>{
      if(res.data.length==2){
          db.collection("team_notice").add({
           data: {
            content: "您有球队约球信息发生改变，请查看",
            warn_id: res.data[1]._openid,
            team_yueqiu_id: this.data.id,
            type: 0
           },
           success: res => {
           }
          })  
      }
     }
    })
    wx.showToast({
     title: '保存成功',
     icon: 'none'
    })
   }
  })
 },
 delTeamYueqiu: function () {
  const db = wx.cloud.database()
  wx.showModal({
   title: '请确认',
   content: '是否删除该约球',
   success: res => {
    if (res.confirm) {
     db.collection("yueqiu_team_information").doc(this.data.id).remove({
      success: res => {
       db.collection("team_pk_list").where({ game_id: this.data.id }).get({/**将记录加入删除集合 */
        success: res => {
         for (var i = 0; i < res.data.length; i++) {
          db.collection("delete_team_pk_list").add({
           data: {
            team_pk_list_id: res.data[i]._id
           },
           success: res => {
            wx.showToast({
             title: '删除成功',
            })           
           }
          })
         }
        }
       })
      }
     })
     wx.navigateBack({

     })
    } else {

    }
   }
  })

 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     id:options.id,
     startDate:getApp().globalData.now
    })
    this.showOrigin()
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