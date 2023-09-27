//添加数据
//数据
data:{
    Productor: [],
    PageSize: 0,
    ImageUrl: [],
    id: "",
},
//函数
Submit(event) {
    var emp = event.detail.value;
    if (emp['username'] && emp['name'] && emp['tel'] || emp['addr'] && this.data.image) {
      var user = {
        '_id': GenerateTime(),
        'Address': emp['addr'],
        'Date': formatTime(new Date),
        'ImageUrl': this.data.ImageUrl,
        'UserName': emp['username'],
        'Name': emp['name'],
        'Price': emp['price'],
        'State': false,
        'Tel': emp['tel'],
        'UserId': wx.getStorageSync('Id')
      } 
      Add(user,'Product');
    } else {
      wx.showToast({
        title: "你的关键信息不能为空,必须填写!",
        icon: "none",
        duration: 2000
      })
      return
    }
},
//用户点击选择图片执行的函数
OnClickChoiceImage(){
  var exmp  =  Choiceimage(this.data.ImageUrl)
  this.setData({
     ImageUrl: exmp
  })
},
//查找所有数据(如果当前是普通用户,显示的是已经上架的,如果当前是管理员登录查看上架和未上架的)
findAll() {
    var judge = wx.getStorageSync('Id')=='Manger'?true:false
    var db = wx.cloud.database()
    db.collection("Productor").where({
      State: judge
    }).orderBy("_id", "desc").skip(this.data.PageSize).limit(30).get().then(res => {
      this.setData({
        Productor: this.data.Productor.push(res.data),
        PageSize: this.data.PageSize + 30
      })
    })
},
//下拉刷新数据(此处应该是局部刷新,将这个代码放在局部刷新的代码里,其他页面同理也是这样)
onPullDownRefresh() {
    //加载数据,初始化的Pagesize的大小为0,用户下拉一次,Pagesize加30(30是一页展示的数据)
    findAll() 
    wx.stopPullDownRefresh();
},
//搜索商品(和文章类页面共用一个代码,具体逻辑在文章类页面,这个只是当前一个事件函数,进行跳转)
handleSubmit(e) {
    const { value } = e.detail.value;
    const { type } = 'Productor'
    if (value.length === 0) return;
    wx.navigateTo({
      url: `/pages/goods/result/index?searchValue=${value}&type=${type}`,
    });
},
//商品详情页面的跳转
LeapSwitch(event){
    wx.navigateTo({
      url: `/pages/detail/index?spuId=${event}`,
    });
},
//商品
//数据详情页面的具体代码
data:{
    Goods: {},
    State: false,
},
//函数(页面需要判断一下,如果当前是true就添加一个当前商品通过的按钮)
onLoad(options) {
    const id = options;
    var db = wx.cloud.database().collection("Productor")
    db.doc(id).get({
      success: function (res) {
        var judge = wx.getStorageSync('Id') == 'Manger(具体看管理员手机里边的id)'? true : false
        that.setData({
          Goods: res.data,
          State: judge
        })
      }.catch(
        wx.showToast({
          title: '不好意思,当前商品可能已经下架了',
          icon: 'none',
          duration: 2000//持续的时间
        }))
    })
},
//管理员修改商品的状态(可能是上架,也可能是下架,集成在./Utils/Tool.js)
//用户查看自己的商品
data{
    SkipSize: 0,
    GoodsList: [],
},
CheckOneProductor(){
    var id = wx.getStorageSync('Id');
    var db = wx.cloud.database().collection("Productor");
    db.where({
      UserId: id
    }).skip(this.data.SkipSize).limit(30).get().then(res => {
      this.setData({
        GoodsList: this.data.GoodsList.push(res.data),
        SkipSize: SkipSize + 30
      })
    })
},
//删除
//在./Utils/Tool.js
//修改(用户修改)
Update(Productor,ImageUrl) {
    JudgeImageAndVideo(News,ImageUrl,undefined);
    var db = wx.cloud.database.collection("Productor");
    db.doc(Productor._id).update({
      data: {
        Address: Productor.Address,
        Date: Productor.Date,
        Imageurl: Productor.Imageurl,
        Name: Productor.Name,
        Price: Productor.Price,
        State: Productor.State,
        Tel: Productor.Tel,
      }, success(res) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
      } 
    })
},



