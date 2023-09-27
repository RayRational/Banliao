data: {
    ImageUrl: [],
    VideoUrl: [],
    examp: {},
    PageSize: 0,
    HomestayList: [],
    SkipSize: 0,
  },
  //函数
//函数
//用户点击选择图片执行的函数
OnClickChoiceImages(){
  var exmp  =  Choiceimage(this.data.ImageUrl)
  this.setData({
     ImageUrl: exmp
  })
},
//用户点击选择视频执行的函数
OnClickChoiceVideo(){
  var exmp  =  Choiceimage(this.data.VideoUrl)
  this.setData({
     VideoUrl: exmp
  })
},
  //提交
  Submit(event) {
    //表单提交
    var emp = event.detail.value
    if (emp['Title'] && emp['Description'] && emp['Price'] && emp['Site'] && emp['Tel'] && this.data.ImageUrl && this.data.VideoUrl) {
      var Homestay = {
        "_id": GenerateTime(),
        'Title': emp['Title'],
        'Description': emp['Description'],
        'Price': emp['Price'],
        'Site': emp['Site'],
        'Tel': emp['Tel'],
        'Type': emp['Type'],
        'ImageUrl': this.data.ImageUrl,
        'VideoUrl': this.data.VideoUrl,
        'State': false,
        'UserId': wx.getStorageSync('Id')
      }
      this.setData({
        examp: Homestay,
      })
      Add(Homestay,Homestay.Type);
    } else {
      wx.showToast({
        title: "信息不能为空",
        icon: "none",
        duration: 2000
      })
      return
    }
  },
  //用户查看自己上架的民宿
  FindOwnHomestay() {
    var id = wx.getStorageSync('Id');
    var db = wx.cloud.database().collection("Homestay");
    db.where({ UserId: id }).skip(this.data.SkipSize).limit(30).get().then(res => {
      this.setData({
        HomestayList: this.data.HomestayList.push(res.data),
        SkipSize: SkipSize + 30,
      })
    })
  },
  //用户删除自己上架的民宿
  //详细代码在./Utils/Tool.js

  //用户更新自己民宿的信息
  Update(Homestay,ImageUrl,VideoUrl){
     JudgeImageAndVideo(News,ImageUrl,VideoUrl);
     var db = wx.cloud.database.collection("Homestay");
     db.doc(Homestay._id).update({
       data: {
         Title: Homestay.Title,
         Description: Homestay.Description,
         Price: Homestay.Price,
         Site: Homestay.Site,
         Tel: Homestay.Tel,
         ImageUrl: Homestay.ImageUrl,
         VideoUrl: Homestay.VideoUrl,
       }, success(res) {
         wx.showToast({
           title: '成功',
           icon: 'success',
           duration: 2000//持续的时间
         })
       } 
     })

  }
  //管理员更新民宿状态(集成在./Utils/Tool.js)
