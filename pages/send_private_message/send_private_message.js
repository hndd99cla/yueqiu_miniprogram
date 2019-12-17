Page({

  /**
   * 页面的初始数据
   */
  data: {
   openid:"",
   message:"",
   clear:"",
   content:[],
   mark:[],
   num:[],
  },

 getMessage:function(e){/**获取输入框的值 */
  this.setData({
   message: e.detail.value
  })
 },

 showChat:function(){/**显示聊天内容  */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("private_message").where(_.or([
   {
    _openid: getApp().globalData.openid,
    sendto_id: this.data.openid
   },
   {
    _openid: this.data.openid,
    sendto_id: getApp().globalData.openid
   }
  ])).get({
   success:res=>{
    this.setData({
     content:res.data
    })
    if(res.data.length!=0){/**两人之间消息数 */
     this.recRead(res.data.length)
    }   
    for(var i=0;i<res.data.length;i++){/**判断是我发的还是对面发的 */
     var k="mark["+i+"]"
     var k_="num["+i+"]"
     if(res.data[i]._openid==getApp().globalData.openid){
      this.setData({
       [k]:true
      })
     }else{
      this.setData({
       [k]:false
      })
     }
     this.setData({
      [k_]:((res.data[i].content.length/16).toFixed(0))*70+70
     })
    }
   }
  })
 },

 sendMessage:function(){/**发送消息 */
  this.setData({/**发送完清空 */
   clear:"",
  })
  const db=wx.cloud.database()
        db.collection("private_message").add({
         data: {
          sendto_id:this.data.openid,
          content:this.data.message,
          icon:getApp().globalData.avatarUrl
         },
         success:res=>{
          this.onShow()
         }
        }) 
 },

 recRead:function(num){/**记录读过的信息条数，若下次开启小程序条数大于此，则说明有新消息 */
   const db=wx.cloud.database()
   db.collection("rec_readed").where({
    _openid: getApp().globalData.openid,
    sendto_id: this.data.openid
   }).get({
    success:res=>{
     if(res.data.length==0){
      db.collection("rec_readed").add({
       data:{
        sendto_id:this.data.openid,
        num:num,
       }
      })
     }else{
      db.collection("rec_readed").doc(res.data[0]._id).update({
       data:{
        num:num
       }
      })
     }
    }
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     openid:options.openid
    })
    wx.setNavigationBarTitle({
     title:options.nickName,
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
    this.showChat()
   
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