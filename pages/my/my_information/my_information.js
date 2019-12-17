const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
 data: {
   userInfo: {
   place:'',
   icon:''
  },
  genderArr: ['后卫', '前锋','中锋'],
  name:'',
  height:'',
  weight:'',
  position:'',
 },

 changeGender: function (e) {
  this.setData({
   'userInfo.place': e.detail.value,
  })
 },

 bindSave:function(e){/**点击保存 */
  const db=wx.cloud.database()
      db.collection("my_information").where({ _openid: app.globalData.openid}).get({
       success:res=>{     
        if(res.data.length==0){/**如果是第一次保存 */
         db.collection("my_information").add({
          data:{
           my_name: e.detail.value.name,
           my_place: this.data.genderArr[this.data.userInfo.place],
           my_height:e.detail.value.height,
           my_weight:e.detail.value.weight,
           my_palce_num: this.data.userInfo.place,
           my_icon: app.globalData.avatarUrl,
           my_sex: app.globalData.sex,
           my_nickName: app.globalData.nickName
          }
         })
        } else{/**保存过的 */
         db.collection("my_information").doc(res.data[0]._id).update({
          data:{
           my_name: e.detail.value.name,
           my_place:this.data.genderArr[this.data.userInfo.place],
           my_height: e.detail.value.height,
           my_weight: e.detail.value.weight,
           my_palce_num: this.data.userInfo.place,
          }         
         })
        } 
       }
      })
  wx.showToast({
   title: '保存成功',
  })
 },

setValue:function(){/**设置输入框上次保存的值 */
 const db = wx.cloud.database()
 db.collection("my_information").where({ _openid: app.globalData.openid}).get({
  success:res=>{
   this.setData({
    name:res.data[0].my_name,
    'userInfo.place':res.data[0].my_palce_num,
    height:res.data[0].my_height,
    weight:res.data[0].my_weight
   })
  }
 })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
    icon: app.globalData.avatarUrl,
   })
   this.setValue()
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