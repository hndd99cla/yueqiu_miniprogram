// pages/launchBall/launchBall.js
const app=getApp()
Page({
 
  data: {
    list:[/*选择人数的数量*/ 
     '2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'
    ],
    selectedNum:'',
    phoneNum:'',
    latitude: '',
    longitude: '',
    endDate:'2020-12-31',
    startTime:'00:00',
    endTime:'24:00',
    id:'',
    user_image:"",
  },

  changeNum:function(e){/**设置人数 */
   this.setData({
    selectedNum:e.detail.value
   })
  },

  selectLocation:function(){/**设置位置 */
   const this_=this
   wx.getSetting({
    success: (res) => {
     if (res.authSetting['scope.userLocation'] != undefined && res.authSetting ['scope.userLocation'] != true) {
      //未授权
      wx.showModal({
       title: '请求授权当前位置',
       content: '需要获取您的地理位置，请确认授权',
       success: function (res) {
         if(res.cancel){
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
      latitude:res.latitude,
      longitude:res.longitude
     })
    },
   })
  },


  changeDate:function(e){/**设置日期 */
   this.setData({
   date:e.detail.value
   })
  },

  changeTime:function(e){/**设置时间 */
   this.setData({
   selectTime:e.detail.value
  })
  },

  bindCancel:function(){/**返回上一页 */
   wx.navigateBack({
   })

  },

 bindLaunch:function(e){/**发布约球信息 */
   const db = wx.cloud.database()
  if (this.data.list[this.data.selectedNum] != null & this.data.mylocation != null & this.data.date != null & this.data.selectTime!=null){/**如果人数、地点、日期、时间都填写了 */
   db.collection('yueqiu_information').add({
    data: {
     i_num: new Number(this.data.list[this.data.selectedNum]),
     i_phone_num: e.detail.value.phoneNum,
     i_location: this.data.mylocation,
     i_latitude: this.data.latitude,
     i_longitude: this.data.longitude,
     i_date: this.data.date,
     i_date_num: new Number(new Date(this.data.date)),
     i_time: this.data.selectTime,
     i_explain: e.detail.value.explain,
     i_image: app.globalData.avatarUrl
    },
    success: res => {/**发起约球的用户自动加入 */
     db.collection("join_list").add({
      data: {
       yueqiu_id: res._id,
       user_image: app.globalData.avatarUrl,
       user_name:app.globalData.nickName
      }
     })
     wx.showToast({
      title: '发布成功',
     })
    },
    fail: err => {
     wx.showToast({
      icon: 'none',
      title: '新增记录失败'
     })
    }
   })
   this.bindCancel()
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
     startDate:app.globalData.now
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
   /** 设置上个页面遮罩层消失 */
   var pages = getCurrentPages()
   var prevPage = pages[pages.length - 2]
   prevPage.setData({
    isRuleTrue: false,
    hide1: true,
    hide2: true,
   })
    
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
