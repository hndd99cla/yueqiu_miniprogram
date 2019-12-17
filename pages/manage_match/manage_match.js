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
    cate_name: "赛程设置",
   },
   {
    cate_id:3,
    cate_name:"数据统计"
   },
   {
    cate_id:4,
    cate_name:"其他设置",
   }
  ],
  curNav: 1,
  dateList:[],
  numList:[],
  modal:true,
  modal_:true,
  modal__:true,
  modal___:true,
  score:true,
  selectedFlag: [false, false,false,false,false],
  deleteList:[]
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

 showJoinTeam:function(){/**显示参赛的球队 */
   const db=wx.cloud.database()
   const _=db.command
   db.collection("delete_match_list").where({match_id:this.data.id}).get({
    success:res=>{
     for(var i=0;i<res.data.length;i++){
      var k="deleteList["+i+"]"
      this.setData({
       [k]:res.data[i].join_match_id
      })
     }     
     db.collection("join_match_list").where({ 
      match_id: this.data.id,
      _id:_.nin(this.data.deleteList)
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
 tick:function(e){/**踢出参赛球队 */
  const db=wx.cloud.database()
  wx.showModal({
   title: '请确认',
   content: '是否踢出该队伍',
   success:res=>{
    if(res.confirm){/**踢出 */
     db.collection("delete_match_list").add({
      data:{
       team_id:e.currentTarget.dataset.teamid,
       match_id:this.data.id,
       join_match_id:e.currentTarget.dataset.id
      },
      success:res=>{
       this.showJoinTeam()
      }
     })
    }else{

    }
    
   }
  })

 },

 addDate:function(e){/**点击添加日期 设置比赛时间 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("match_list").doc(this.data.id).update({
   data:{
    schedule: _.push([[e.detail.value]])
   },
   success:res=>{
    this.showSchedule()
   }
  })
 },
 delDate: function (e) {/**点击删除最后一个日期*/
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("match_list").doc(this.data.id).update({
   data: {
    schedule: _.pop()
   },
   success: res => {
    this.showSchedule()
   }
  })
 },

 showSchedule:function(){/**显示赛程 */
  const db=wx.cloud.database()
  db.collection("match_list").where({_id:this.data.id}).get({
   success:res=>{   
    for(var i=0;i<res.data[0].schedule.length;i++){/**判断日期下面有多少场比赛 */
     var k ="numList["+i+"]"
     this.setData({
      [k]:(res.data[0].schedule[i].length-1)
     })
    }
    for(var i=0;i<res.data[0].results.length;i++){/**判断每组战绩下面多少队 */
     var k="numList_["+i+"]"
     this.setData({
      [k]:(res.data[0].results[i].length-1)
     })
    }
    this.setData({
     dateList:res.data[0].schedule,
     groupList:res.data[0].results,
     scoreList:res.data[0].score_rank
    })
   }
  })
 },

 addScore:function(e){/**增加比赛结果 */
  this.setData({
   modal:!this.data.modal,
   date:e.currentTarget.dataset.date
  })
 },
 delScore:function(e){/**删除比分最后一项 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("match_list").where({ _id:this.data.id }).get({
   success:res=>{
    for(var i=0;i<res.data[0].schedule.length;i++) {
     if(res.data[0].schedule[i][0]==e.currentTarget.dataset.date) {/**点击删除几号比赛结果就删除该日期的比赛数据 */
      var k="schedule."+i
       db.collection("match_list").doc(this.data.id).update({
        data:{
         [k]:_.pop()
        },
        success:res=>{
         this.showSchedule()
        }
       })
      }
     }
    }  
  })
 },

 cancel:function(){
  this.setData({
   modal:true
  })
 },
 confirm:function(e){/**点击确定 */
  this.setData({
   modal:true
  })
  const db=wx.cloud.database()
  const _=db.command
  db.collection("match_list").where({ _id:this.data.id }).get({
   success:res=>{
    for(var i=0;i<res.data[0].schedule.length;i++){
     if(res.data[0].schedule[i][0]==this.data.date) {/**点击添加几号的就向几号的数组增加比赛数据 */
      var k="schedule."+i
      db.collection("match_list").doc(this.data.id).update({
       data: {
        [k]: _.push([[this.data.tip,this.data.name1,this.data.score1,this.data.score2,this.data.name2]])
       },
       success: res => {
        this.showSchedule()
       }
      })
     }
    }
   }
  })
 },
 tip:function(e){/**点击比赛结果进行修改 */
  this.setData({
   tip:e.detail.value
  })
 },
 setScore1:function(e){
  this.setData({
   name1:e.detail.value
  })
 },
 setScore2: function (e) {
  this.setData({
   score1: e.detail.value
  })
 },
 setScore3: function (e) {
  this.setData({
   name2: e.detail.value
  })
 },
 setScore4: function (e) {
  this.setData({
   score2: e.detail.value
  })
 },

 revise:function(e){
  this.setData({
   modal_:!this.data.modal_,
   cur:e.currentTarget.dataset.data,
   revise1:e.currentTarget.dataset.date,
   revise2:e.currentTarget.dataset.index,
   revise3:e.currentTarget.dataset.num
  }) 
 },
 cancel_:function(){
  this.setData({
   modal_:true
  })
 },
 confirm_:function(e){/**确定修改数据 */
  this.setData({
   modal_:true
  })
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("match_list").where({_id:this.data.id}).get({/**修改数据 */
   success:res=>{
    for(var i=0;i<res.data[0].schedule.length;i++){
     if(res.data[0].schedule[i][0]==this.data.revise1) {
      var k="schedule."+i+"."+this.data.revise2+"."+this.data.revise3
      db.collection("match_list").doc(this.data.id).update({
       data:{
        [k]:this.data.tip
       },
       success: res => {
        this.showSchedule()
       }
      })
     }
    }
   }
  })
 },
 to:function(){
  
 },
 addGroup:function() {/**添加分组 */
  this.setData({
   modal__:!this.data.modal
  })
 },
 delGroup: function (e) {/**点击删除最后一个组*/
  const db = wx.cloud.database()
  const _ = db.command
  db.collection("match_list").doc(this.data.id).update({
   data: {
    results: _.pop()
   },
   success: res => {
    this.showSchedule()
   }
  })
 },
 cancel__:function(){
  this.setData({
   modal__:true
  })
 },
 setGroup: function (e) {
  this.setData({
   group: e.detail.value
  })
 },
 confirm__:function(e){/**确定增加分组 */
  this.setData({
   modal__:true
  })
  const db=wx.cloud.database()
  const _=db.command
  db.collection("match_list").doc(this.data.id).update({
   data:{
    results: _.push([[this.data.group]])
   },
   success:res=>{
    this.showSchedule()
   }
  })
 },
 addRes:function(e){/**增加该组的一个球队的战绩 */
  this.setData({
   modal___:false,
   gro:e.currentTarget.dataset.group
  })
 },
 cancel___:function(){
  this.setData({
   modal___:true
  })
 },
 setRes1:function(e){
  this.setData({
   re1:e.detail.value
  })
 },
 setRes2: function (e) {
  this.setData({
   re2: e.detail.value
  })
 },
 setRes3: function (e) {
  this.setData({
   re3: e.detail.value
  })
 },
 confirm___:function(e){/**确定增加战绩 */
  this.setData({
   modal___:true
  })
  const db=wx.cloud.database()
  const _=db.command
  var k="results."+this.data.gro
  db.collection("match_list").doc(this.data.id).update({
   data:{
    [k]:_.push([[this.data.re1,this.data.re2,this.data.re3]])
   },
   success:res=>{
    this.showSchedule()
   }
  })
 },
 delRes:function(e){//*删除一个球队战绩 */
  const db = wx.cloud.database()
  const _ = db.command
  var k="results."+e.currentTarget.dataset.group
  db.collection("match_list").doc(this.data.id).update({
   data:{
    [k]:_.pop()
   },
   success:res=>{
    this.showSchedule()
   }
  })
 },
 addPlayerSroce:function(){
  this.setData({
   score:false
  })
 },
 cancelScore:function(){
  this.setData({
   score: true
  })
 },
 setGetScore1:function(e){
  this.setData({
   playerName:e.detail.value
  })
 },
 setGetScore2:function(e){
  this.setData({
   getScore:e.detail.value
  })
 },
 confirmScore:function(){/**添加一个球员的场均得分 */
  this.setData({
   score: true
  })
  const db=wx.cloud.database()
  const _=db.command
  db.collection("match_list").doc(this.data.id).update({
   data:{
    score_rank:_.push([[this.data.playerName,this.data.getScore]])
   },
   success:res=>{
    this.showSchedule()
   }
  })
 },
 delPlayerSroce:function(){/**删除最后一个球员 */
  const db=wx.cloud.database()
  const _=db.command
  db.collection("match_list").doc(this.data.id).update({
   data:{
    score_rank:_.pop()
   },
   success:res=>{
    this.showSchedule()
   }
  })
 },

 daiding:function(){
  wx.showToast({
   title: '已成功申请~',
   icon:'none'
  })
 },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
     id:options.id,
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