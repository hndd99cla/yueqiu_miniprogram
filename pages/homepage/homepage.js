const app = getApp();
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   imageList:[/**轮播图 */
    "cloud://lzx-3b14c7.6c7a-lzx-3b14c7/match_post/timg.png",
    "cloud://lzx-3b14c7.6c7a-lzx-3b14c7/match_post/99EM-hvntnkr0138037.png",
    "cloud://lzx-3b14c7.6c7a-lzx-3b14c7/match_post/vYhrgGjcYf.png",
   ],
   swiperCurrent:0,
   city: '加载中',
   numList:[],
   tuijian:[]
  },
 
 getLocal:function(latitude,longitude){/**获取当前城市名称 */
    let that=this;
    qqmapsdk.reverseGeocoder({
      location:{
        latitude:latitude,
        longitude:longitude
      },
      success:function(res){
        that.setData({
          city: res.result.ad_info.city,
        })
      },
    });
 },

 getData:function(e){/**获取搜索框里的值 */
   this.setData({
    data:e.detail.value
   })
 },

 search:function(e){/**点击按钮查找个人约球和团战约球中符合搜索条件的项 */
   wx.showLoading({
    title: '搜索中',
    mask:true,
   })
   const db=wx.cloud.database()
   const _=db.command
   db.collection("yueqiu_team_information").where(_.or([/**按条件查找球队约球  */
    {
     _id: db.RegExp({
      regexp: this.data.data,
      options: "i",/**i 大小写不敏感 */
     }),
     team_date_num: _.gt(app.globalData.now_num)
    },
    {
     team_location: db.RegExp({
      regexp: this.data.data,
      options: "i",
     }),
     team_date_num: _.gt(app.globalData.now_num)
    }
   ])).get({
    success:res_=>{
     db.collection("yueqiu_information").where(_.or([/**按条件查找个人约球 */
      {
       _id: db.RegExp({
        regexp: this.data.data,
        options: "i",
       }),
       i_date_num: _.gt(app.globalData.now_num)
      },
      {
       i_location: db.RegExp({
        regexp: this.data.data,
        options: "i",
       }),
       i_date_num: _.gt(app.globalData.now_num)
      }
     ])).get({
      success:res=>{
       wx.navigateTo({
        url: '/pages/search_result/search_result?searchList=' + JSON.stringify(res.data) + '&searchList_=' + JSON.stringify(res_.data),
       })
      }
     })
    }
   })  
   setTimeout(function () {
    wx.hideLoading()
   }, 2000)
 },

 

 swiperChange:function(e){/**轮播图监听 */
  this.setData({
   swiperCurrent: e.detail.current
  })
 },
 postNav:function(){
  if(this.data.swiperCurrent==0){
   wx.showToast({
    title:'有问题请拨打电话！',
    icon:'none'
   })
  }
  if(this.data.swiperCurrent==1){
   wx.showToast({
    title: '观看NBA季后赛请移师正规渠道！',
    icon:'none'
   })
  }
  if(this.data.swiperCurrent==2){
   wx.navigateTo({
    url: '/pages/match_detail/match_detail?id=' +'XIoHSt7E7L4wtqXL',
   })
  }
 },
 showFriend:function(){/**显示球友 */
   const db=wx.cloud.database()
   db.collection("user_list").get({
    success:res=>{
     wx.navigateTo({
      url: '/pages/show_teamormember/show_teamormember?type=1&list='+JSON.stringify(res.data),
     })
    }
   })  
 },
 showTeam:function(){/**显示球队 */
  const db = wx.cloud.database()
  db.collection("team_information").get({
   success: res => {
    wx.navigateTo({
     url: '/pages/show_teamormember/show_teamormember?type=2&list=' + JSON.stringify(res.data),
    })
   }
  })
 },

 showTuijian:function(){/**推荐约球的显示 这里是推荐20km以内的约球 */
   const db=wx.cloud.database()
   const _=db.command
   db.collection("yueqiu_information").where({i_date_num:_.gt(app.globalData.now_num)}).get({
   success:res=>{
    var j=0  
    for(var i=0;i<res.data.length;i++){
     if (util.distance(app.globalData.latitude,app.globalData.longitude, res.data[i].i_latitude, res.data[i].i_longitude)<20){     
      var k="tuijian["+j+"]"
      this.setData({
       [k]:res.data[i]
      })
      j++
     }
    }
   }
  })
 }, 

 toYueqiu:function(e){/**点击推荐约球跳转 */
  wx.navigateTo({
   url: '../yueqiu_detailpage/yueqiu_detailpage?id='+e.currentTarget.dataset.id+'&over='+0,
  })
 },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   qqmapsdk = new QQMapWX({
    key: 'IZABZ-XTZHJ-CX4FF-FHKJK-RICR3-OXBCS' 
   })
   this.getLocal(app.globalData.latitude,app.globalData.longitude)
   
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
   this.showTuijian()
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
   this.onShow()
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