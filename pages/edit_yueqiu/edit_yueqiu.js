Page({

  /**
   * 页面的初始数据
   */
  data: {
   id:"",
   list:[],
   numList: ['2','3','4','5','6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'],
   selectedNum:'',
   endDate:'2020-12-31'
  },

  showOrigin:function(){/**显示详情 */
   const db=wx.cloud.database()
   db.collection("yueqiu_information").where({_id:this.data.id}).get({
    success:res=>{
     this.setData({
      list:res.data[0]
     })
    }
   })
  },

  changeNum:function(e){
   var k="list.i_num"
   this.setData({
    [k]:this.data.numList[e.detail.value]
   })
  },

 selectLocation:function(){/**修改 */
  var that=this
  var k="list.i_location"
  var k_="list.i_latitude"
  var k__="list.i_longitude"
  wx.chooseLocation({
   success: function (res) {
    that.setData({
     [k]: res.name,
     [k_]:res.latitude,
     [k__]:res.longitude
    })
   },
  })
 },
 changeDate:function(e) {/**设置日期 */
  var k="list.i_date"
  this.setData({
   [k]:e.detail.value
  })
 },
 changeTime:function(e) {/**设置时间 */
  var k = "list.i_time"
  this.setData({
   [k]:e.detail.value
  })
 },

 bindSave:function(e){
  const db=wx.cloud.database()
  db.collection("yueqiu_information").doc(this.data.id).update({
   data:{
    i_num:new Number(e.detail.value.setNum),
    i_phone_num:e.detail.value.phoneNum,
    i_location: e.detail.value.setLocation,
    i_latitude:this.data.list.i_latitude,
    i_longitude:this.data.list.i_longitude,
    i_date:e.detail.value.setStartDate,
    i_date_num: new Number(new Date(e.detail.value.setStartDate)),
    i_time:e.detail.value.setTime,
    i_explain:e.detail.value.setExplain
   },
   success:res=>{
    db.collection("join_list").where({ yueqiu_id:this.data.id}).get({/**当改变信息后给所有参加的人发送消息提醒 */
     success:res=>{
      var j=1
      for(var i=1;i<res.data.length;i++){  /**从1开始因为不给自己发 */
           db.collection("yueqiu_notice").add({
            data: {
             content: "您有约球信息发生改变，请查看",
             yueqiu_id:this.data.id,
             warn_id: res.data[j]._openid,
             type: 0
            },
            success:res=>{             
            }
           })         
          j++      
      }
     }
    })
    wx.showToast({
     title: '保存成功',
     icon:'none'
    })
   }  
  })
 },

 delYueqiu:function(){
   const db=wx.cloud.database()
   wx.showModal({
    title:'请确认',
    content: '是否删除该约球',
    success:res=>{
     if(res.confirm){/**如果确定删除 */
      db.collection("yueqiu_information").doc(this.data.id).remove({/**删除自己加入记录 */
       success:res=>{
        db.collection("join_list").where({yueqiu_id:this.data.id}).get({
         success:res=>{
          for(var i=0;i<res.data.length;i++){
           db.collection("delete_join_list").add({/**在删除集合增加其他人也退出的记录 */
            data:{
             join_list_id:res.data[i]._id
            },
            success:res=>{
             wx.showToast({
              title: '删除成功',
             })
             wx.navigateBack({
              
             })
            }
           })
          }
         }
        })
       }
      })
     }else{
      
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
   this.showOrigin()/**防止选择完位置后刷新  所以放onLoad */
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