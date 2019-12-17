Page({
  /** 
   * 页面的初始数据
   */
  data: {
    teamList:[],
    teamIdList:[],
    teamLogoList:[],
    typeList: ['半场', '全场'],
    latitude: '',
    longitude: '',
    endDate: '2020-12-31',
    startTime: '00:00',
    endTime: '24:00',
  },

 selectTeam:function(){/**在自己创建的球队里选择发起的球队 */
  var that=this 
  const db=wx.cloud.database()
  db.collection("team_information").where({_openid:getApp().globalData.openid}).get({
   success:res=>{  
    for(var i=0;i<res.data.length;i++){
     var k="teamList["+i+"]"
     var x="teamIdList["+i+"]"
     var y="teamLogoList["+i+"]"
     this.setData({
      [k]:res.data[i].team_name,
      [x]:res.data[i]._id,
      [y]:res.data[i].team_logo_fileid
     })
    }
    if(this.data.teamList.length>0){/**如果有创建过球队 */
     wx.showActionSheet({
      itemList: this.data.teamList,
      itemColor: "#4B0082",
      success: function (res) {
       that.setData({
        index: res.tapIndex
       })
      },
      fail: function (res) {
      }
     })
    }else{
     wx.showToast({
      title: '您还没有球队，快去创建吧！',
      icon:'none',
     })
    }
    
   }
  })
 },  
 selectType:function(){/**选择对战类型 */
  var that=this
  wx.showActionSheet({
   itemList:this.data.typeList,
   success: function (res) {
    that.setData({
     type:res.tapIndex
    })
   },
   fail: function (res) {
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
     latitude: res.latitude,
     longitude: res.longitude
    })

   },
  })
 },


 changeDate: function (e) {/**设置日期 */
  this.setData({
   date: e.detail.value
  })
 },

 changeTime: function (e) {/**设置时间 */
  this.setData({
   selectTime: e.detail.value
  })
 },

 bindCancel: function () {/**返回上一页 */
  wx.navigateBack({
  })
 },

 bindLaunch:function(e){/**球队发起约球 */
  var explain = e.detail.value.explain
  const db=wx.cloud.database()
  if (this.data.teamList[this.data.index] != null & this.data.typeList[this.data.type]!=null&this.data.mylocation!=null&this.data.date!=null&this.data.selectTime!=null){/**如果所有信息填写完整 */
   db.collection("yueqiu_team_information").add({
    data: {
     my_team_id: this.data.teamIdList[this.data.index],
     game_type: this.data.typeList[this.data.type],
     team_location: this.data.mylocation,
     team_latitude: this.data.latitude,
     team_longitude: this.data.longitude,
     team_date: this.data.date,
     team_date_num: new Number(new Date(this.data.date)),
     team_time: this.data.selectTime,
     team_explain: explain,
     team_logo: this.data.teamLogoList[this.data.index]
    },
    success: res => {/**发起约球的球队自动加入 */
     db.collection("team_pk_list").add({
      data: {
       game_id: res._id,
       team_id: this.data.teamIdList[this.data.index]
      }
     })
     wx.showToast({
      title: '发布成功',
     })
    },
    fail: err => {
     wx.showToast({
      icon: 'none',
      title: '失败'
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
     startDate: getApp().globalData.now
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