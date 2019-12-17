Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    matchList:[],
    teamList:[],
    deleteList:[]
  },
  
  showDetail:function(){/**显示详情 */
   const db=wx.cloud.database()
   db.collection("match_list").where({_id:this.data.id}).get({
    success:res=>{
     this.setData({
      matchList: res.data[0]
     })
    }
   })
  },
  

  join:function(){/**报名比赛 选择我创建的一个球队参加 */
   const db=wx.cloud.database()
   const _=db.command
   var that=this
   db.collection("delete_match_list").where({match_id:this.data.id}).get({
    success:res=>{
     for (var i = 0; i < res.data.length; i++) {
      var k = "deleteList[" + i + "]"
      this.setData({
       [k]: res.data[i].join_match_id
      })
     }
    }
   })
   db.collection("team_information").where({_openid:getApp().globalData.openid}).get({
    success:res=>{
     for (var i=0;i<res.data.length;i++) {
      var k="teamList["+i+"]"
      this.setData({
       [k]:res.data[i].team_name,
      })
     }
     if(this.data.teamList.length>0){/**如果创建过球队 */
      wx.showActionSheet({
       itemList: this.data.teamList,
       itemColor: "#4B0082",
       success: function (res1) {
        db.collection("join_match_list").where({
         match_id: that.data.id,
         team_id: res.data[res1.tapIndex]._id,
         _id:_.nin(that.data.deleteList)
        }).get({
         success: res2 => {
          if (res2.data.length == 0) {/**如果选择的球队没参加 */
           db.collection("join_match_list").add({
            data: {
             team_id: res.data[res1.tapIndex]._id,
             match_id: that.data.id,
             team_name: res.data[res1.tapIndex].team_name,
             team_logo: res.data[res1.tapIndex].team_logo_fileid,
            },
            success: res => {
             wx.showToast({
              title: '报名成功',
             })
            }
           })
           wx.navigateBack({
           })
          } else {/**否则提示已参加 */
           wx.showToast({
            title: '您的球队已参加',
            icon: 'none'
           })
          }
         }
        })
       },
      })

     }else{
      wx.showToast({
       title: '请先创建球队',
       icon:'none'
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
     id:options.id
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
    this.showDetail()
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