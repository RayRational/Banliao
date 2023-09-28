
//全查
//数据
data{
    imgSrcs: [],
    id: [],
    type: [],
    tabList: [],
    News: [],
    Travel: [],
    Culture: [],
    Homestay: [],
    News: [],
    CurrentTag: [],
    skipsize: 0,
},
//函数(民宿和文章类型的字段不一样,要单独循环渲染)
loadHomePage() {
    var db = wx.cloud.database();
    const AllPromise = Promise.all([
      db.collection("Travel").orderBy("_id", "desc").limit(30).get(),
      db.collection("News").orderBy("_id", "desc").limit(30).get(),
      db.collection("Culture").orderBy("_id", "desc").limit(30).get(),
      db.collection("Homestay").where({State:true}).limit(30).get()]),

    AllPromise.then((res) => {
      var alldata = []
      var url = []
      var id = []
      var type = []
      alldata.push(res[0].data);
      alldata.push(res[1].data);
      url.push(res[2].data[0].ImageUrl)
      id.push(res[2].data[0]._id)
      type.push(res[2].data[0].Type)
      for (let index = 0; index < 3; index++) {
        var a = Math.floor(Math.random() * alldata.length)
        var b = Math.floor(Math.random() + 0.5)
        var Exmp = alldata[b][a]
        url.push(Exmp.ImageUrl)
        id.push(Exmp._id)
        type.push(Exmp.Type)
      }
      this.setData({
        Travel: res[0].data,
        News: res[1].data,
        Culture: res[2].data,
        Homestay: res[3].data,
        imgSrcs: url,
        id: id,
        type: type,
        tabList: [{
          text: '太白文化',
          key: 0,
        },
        {
          text: '新  闻',
          key: 1,
        },
        {
          text: '旅游',
          key: 2
        },
        {
          'text': '民宿',
          key: 3
        }
        ],
        pageLoading: false,
      })
      this.loadGoodsList(true);
    })
    wx.stopPullDownRefresh();
    this.setData({
      pageLoading: true,
    });
},
//loadGoodsList是加载数据的函数(自带的)
//控制不同类型的列表,用户点击那个,与之对应的列表就会改变
tabChangeHandle(e) {
    switch (e.detail.value) {
      case 0:
        this.loadGoodsList(true, this.data.Travel)
        break;
      case 1:
        this.loadGoodsList(true, this.data.News)
        break;
      case 2:
        this.loadGoodsList(true, this.data.Culture)
        break;
      case 3:
        this.loadGoodsList(true, this.data.Homestay);
    }
},
onPullDownRefresh() {
  //用户下滑,然后分页
   if(this.CurrentTag.Type=='Homestay'){
    wx.cloud.database().collection(this.CurrentTag.Type).where({State : true}).orderBy("_id", "desc").skip(this.data.skipsize).limit(30).get().then(res=>{
      this.setData({
        CurrentTag: CurrentTag.push(res.data),
      })
    })
   }else{
    wx.cloud.database().collection(this.CurrentTag.Type).orderBy("_id", "desc").skip(this.data.skipsize).limit(30).get().then(res=>{
      this.setData({
        CurrentTag: CurrentTag.push(res.data),
      })
    })
   }

   wx.stopPullDownRefresh();
},
//自带的,微改
async loadGoodsList(fresh = false, Data=this.data.Culture) {
  
  //前端页面要渲染CurrentTag,CurrentTag是当前用户选择的列表
  if (fresh) {
    wx.pageScrollTo({
      scrollTop: 0,
    });
  }
  this.setData({ goodsListLoadStatus: 1 , skipsize:30,CurrentTag:Data});
  const pageSize = this.goodListPagination.num;
  let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
  if (fresh) {
    pageIndex = 0;
  }
  try {
    // const nextList = await fetchGoodsList(pageIndex, pageSize);
    const nextList = Data
    this.setData({
      goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
      goodsListLoadStatus: 0,
      
    });
    this.goodListPagination.index = pageIndex;
    this.goodListPagination.num = pageSize;
  } catch (err) {
    this.setData({ goodsListLoadStatus: 3 });
  }
},
// 详细查
//列表点击
goodListClickHandle(e) {
    const { index } = e.detail;
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${this.data.goodsList[index]._id}&type=${this.data.goodsList[index].Type}`,
    });
},
//轮播图点击
navToActivityDetail({ detail }) {
    var id = this.data.id[detail.index]
    var type = this.data.type[detail.index]
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${id}&type=${type}`,
    });
},
//跳转到对应页面的代码  /pages/goods/details/index?
//数据
data:{
    List: {},
},
//函数(前端页面需要判断是文章类详情页,还是民宿类详情页  if type != 'Homestay'  else )
getDetail(spuId, type) {
    var db
    switch (type) {
      case "News":
        db = wx.cloud.database().collection("News")
        break;
      case "Culture":
        db = wx.cloud.database().collection("Culture");
        break;
      case "Politics":
        db = wx.cloud.database().collection("Politics");
        break;
      case "Homestay":
        db = wx.cloud.database().collection("Homestay");
    }
    db.where({
      _id: spuId
    }).get({
      success: function (res) {
        this.setData({
          List: res.data
        })
      }
    })
},
//增加
//数据
data:{
    ImageUrl: [],
    VideoUrl: [],
    examp: {},
},
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
    if (emp['Title'] && emp['Author'] && emp['Content'] && emp['Type'] && this.data.ImageUrl && this.data.VideoUrl) {
      var news = {
        "_id": GenerateTime(),
        'Author': emp['Author'],
        'Content': emp['Content'],
        'Date': formatTime(new Date),
        'ImageUrl': this.data.ImageUrl,
        'Title': emp['Title'],
        'Type': emp['type'],
        'VideoUrl': this.data.VideoUrl,
      }
      this.setData({
        examp: news,
      })
      Add(news,news.type);
    } else {
      wx.showToast({
        title: "信息不能为空",
        icon: "none",
        duration: 2000
      })
      return
    }
},
//删除
//数据
data:{},
//详细代码在./Utils/Tool.js
//搜索
//跳转事件函数
navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
},
//数据
data:{
    SearchHis: []
},
//函数
//写入文字之后,点击确定,跳转到搜索结果页面
handleSubmit(e) {
    const { value } = e.detail.value;
    const {type} = e.detail.type;
    if (value.length === 0) return;
    var that = this;
    if(value==null){
      wx.showToast({
        title: '搜索框没字啊,你让我怎么帮你查呢',
        icon: 'none',
        duration: 2000//持续的时间
      })
    }
    WhetherLenGtTen(value);
    wx.navigateTo({
      url: `/pages/goods/result/index?searchValue=${value}&type=${type}`,
    });
},
//存储当前用户查的内容,并判断当前搜索历史个数是否大于10
WhetherLenGtTen(input){
    if(this.data.SearchHis.length<10){
       this.data.SearchHis.push(input);
    }else{
       this.data.SearchHis.shift();
       this.data.SearchHis.push(input);
    }
    wx.setStorageSync('SearchHis', SearchHis)
},
//加载用户的搜索记录(大小限制,只能是10个,放在Onload里边,页面开始渲染用户的搜索记录)
FindSearchHist() {
    this.setData({
      SearchHis: wx.getStorageSync('SearchHis') || [],
    })
},
//搜索结果页面load(商品类和文章类共享)
data:{
    goodsList : [],
    essay : [],
},
onLoad(options) {
    if (options.type == "News") {
      const { searchValue = '' } = options || {};
      var db = wx.cloud.database()
      db.collection("Prodcutor").where({
        Name: db.RegExp({
          regexp: '.*' + searchValue,
          options: 'i', 
        })
      }).get({
        success: res => {
          this.setData({
            goodsList: res.data,
          })
        }, fail: err => {
        }
      })
    }
    else {
      var collname = ""
      if(options.type="News"){ collname = "News"}
      else if(options.type =="Politics"){ collname = "Politics"}
      else{ options.type =="Culture"} {collname="Culture"}
      const { searchValue = '' } = options.value || {};
      var db = wx.cloud.database()
      db.collection(collname).where({
        Name: db.RegExp({
          regexp: '.*' + searchValue,
          options: 'i',
        })
      }).get({
        success: res => {
          this.setData({
            essay: res.data,
          })
        }, fail: err => {
        }
      })
    }
},
//修改(提交表单,要把旧数据带上,这样就不用判断,把旧的视频和图片带上
Update(News,ImageUrl,VideoUrl){
    JudgeImageAndVideo(News,ImageUrl,VideoUrl);
    var db = wx.cloud.database.collection(News.Type);
    db.doc(News._id).update({
        data: {
          Title: News.Title,
          Content: News.Content,
          Author: News.Author,
          ImageUrl: News.ImageUrl,
          VideoUrl: News.VideoUrl,
          Date: formatTime(new Date),
        }, success(res) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000//持续的时间
          })
        }
    })   
},

