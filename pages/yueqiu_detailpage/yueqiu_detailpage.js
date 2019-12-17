const app=getApp()
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    list:[],
    join_list:[],
    user_image:'',
    lack:'',
    mark1:false,  
    mark2:false,
    mark3:false,
  stars: [
   {
    flag: 1,
    bgImg: "/images/star_gray.png",
    bgfImg: "/images/star_yellow.png"
   },
   {
    flag: 1,
    bgImg: "/images/star_gray.png",
    bgfImg: "/images/star_yellow.png"
   },
   {
    flag: 1,
    bgImg: "/images/star_gray.png",
    bgfImg: "/images/star_yellow.png"
   },
   {
    flag: 1,
    bgImg: "/images/star_gray.png",
    bgfImg: "/images/star_yellow.png"
   },
   {
    flag: 1,
    bgImg: "/images/star_gray.png",
    bgfImg: "/images/star_yellow.png"
   },
  ],
   select: false,
   tihuoWay: '选择球友评分'
  },

 score: function (e) {/**评分星星的显示 */
  var that = this;
  for (var i = 0; i < that.data.stars.length; i++) {/**设置allItem：[1,1,1,1,1] */
   var allItem = 'stars[' + i + '].flag';
   that.setData({
    [allItem]: 1
   })
  }
  this.setData({
   starNum:e.currentTarget.dataset.index
  })
  for (var i = 0; i <=this.data.starNum; i++) {/**item[2,2,*,*,*] 不为1则表示亮 点第几颗星星*/
   var item = 'stars[' + i + '].flag';
   that.setData({
    [item]: 2
   })
  }
 },
 
 bindYes:function(){/**点击加入约球 */
  const db=wx.cloud.database()
  if(this.data.list.i_num>this.data.lack){/**如果人数没满可以加入 */
   db.collection("join_list").add({
    data: {
     yueqiu_id: this.data.id,
     user_image: app.globalData.avatarUrl,
     user_name: app.globalData.nickName
    },
    success: res => {
     this.setData({
      mark3: false
     })
     wx.showToast({
      title: '加入成功',
     })
    },
    fail: res => {
    }
   }) 
   this.onShow()
  }else{
   wx.showToast({
    title: '该约球人数已满！',
    icon:'none'
   })
  }
  },

 showJoinIcon:function(){
  /**取得所有加入该约球的人的头像 */
  const db = wx.cloud.database()
  db.collection("join_list").where({ yueqiu_id: this.data.id }).get({
   success: res => {
    this.setData({
     lack:res.data.length,
     join_list: res.data,
    })
   },
  })  
 },

 showDetail:function(){/**显示该约球详情信息 */
  const db = wx.cloud.database()
  db.collection("yueqiu_information").where({ _id: this.data.id }).get({
   success: res => {
    this.setData({
     list:res.data[0]
    })
   }
  })
 },
 
 whetherJoin:function(){/**判断是否已经加入 */
  const db = wx.cloud.database()
  db.collection("join_list").where({
   _openid: app.globalData.openid,
   yueqiu_id: this.data.id
  }).get({
   success:res=>{
    if (res.data.length==1){/**我加入了该约球 */
     db.collection("join_list").where({ yueqiu_id: this.data.id}).get({
       success:res=>{
        if (res.data[0]._openid==app.globalData.openid){/**该约球由我发起  */
         this.setData({
          mark1:true
         })
        }else{/**该约球不是我发起的 */
          this.setData({
           mark2:true
          })
        }
       }
     })
    }else{/*该约球我没加入 */
       this.setData({
        mark3:true
       })
    }
   }
  })
 },

 exit:function(){/**退出约球 */
  const db=wx.cloud.database()
  db.collection("join_list").where({
   _openid:app.globalData.openid,
   yueqiu_id: this.data.id
  }).get({
   success:res=>{
    db.collection("join_list").doc(res.data[0]._id).remove({
     success:res=>{
      wx.showToast({
       title: '退出成功',
      })
      this.setData({
       flag:false
      })
     },    
    })
    wx.navigateBack({
    })
   }
  })
 },
 lookLocation:function(){/**查看此约球的位置 */
  const db=wx.cloud.database()
  db.collection("yueqiu_information").where({_id:this.data.id}).get({
   success:res=>{
    wx.getLocation({
     type: 'wgs84',
     success(res_) {
      const latitude = res.data[0].i_latitude
      const longitude = res.data[0].i_longitude
      wx.openLocation({
       latitude,
       longitude,
       scale: 18
      })
     }
    })
   }
  }) 
 }, 
 bindShowMsg() {/**显示球友昵称框 */
  this.setData({
   select: !this.data.select
  })
 },
 mySelect(e) {/**选择球友 */
  this.setData({
   tihuoWay:e.currentTarget.dataset.name,
   userid:e.currentTarget.dataset.userid,
   select: false
  })
 },

 getEva:function(e){/**获取评论 */
  this.setData({
   comment:e.detail.value
  })
 },

 subScore:function(){/**提交评分和评价 */
  const db=wx.cloud.database()
  if(getApp().globalData.openid!=this.data.userid&this.data.userid!=null){/**如果评价的不是自己 且不为空*/
  if(this.data.comment!=null&this.data.starNum!=null){/**如果有写评语和有评分 */
   db.collection("evaluate_list").add({
    data: {
     eva_user: this.data.userid,
     score: this.data.starNum + 1,
     comment: this.data.comment,
     icon: getApp().globalData.avatarUrl,
     date: this.data.list.i_date
    },
    success: res => {
     wx.showToast({
      title: '评价成功',
      icon: "none"
     })
     for (var i = 0; i < 5; i++) {/**还原 */
      var k = 'stars[' + i + '].flag'
      this.setData({
       [k]: 1
      })
     }
     this.setData({
      tihuoWay: '选择球友评分',
      clear: "",
      comment:null,
      starNum:null,
      userid:null
     })
    }
   })
  }else{
   wx.showToast({
    title: '请评价完整哦~',
    icon: "none"
   })
  } 
  }else{
   wx.showToast({
    title: '球友评价错误~',
    icon:"none"
   })
  } 
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     id:options.id,
     over:options.over/**over为1是在我的约球-已结束进入页面 */
    }) 
    wx.showLoading({
     title: '加载中',
    }) 
   this.showDetail()
   setTimeout(function () {
    wx.hideLoading()
   }, 2000)
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
   this.whetherJoin() 
   this.showJoinIcon()
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