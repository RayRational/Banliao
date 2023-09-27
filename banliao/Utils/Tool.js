//删除的接口,变化不是太大,抽成一个公共的接口
function Delete(Obj,dbname) {
    var db = wx.cloud.database.collection(dataname).doc(Obj.id);
    DeleteImageAndVideo(Obj.ImageUrl,Obj.VideoUrl)
    db.remove({
      success(res) {
        wx.showToast({
          title: "商品已经成功删除"
        })
      }
    })
}
//判断更新的时候,新图片和旧图片的,如果相同了不删,如果不相同的话就删除;同视频
function JudgeImageAndVideo(obj,ImageUrl,VideoUrl){
  if(JSON.stringify(obj.ImageUrl)===JSON.stringify(ImageUrl)&&JSON.stringify(obj.VideoUrl)===JSON.stringify(VideoUrl)){
      return
  }
  if(JSON.stringify(obj.ImageUrl)===JSON.stringify(ImageUrl)&&JSON.stringify(obj.VideoUrl)!==JSON.stringify(VideoUrl)){
       ImageUrl=[]
  }else{
       VideoUrl=[]
  }
  if(VideoUrl==undefined){
    var ExmpImage = [];
    for (let index = 0; index < ImageUrl.length; index++) {
      if(obj.ImageUrl.includes(ImageUrl[index])){
        ExmpImage.push(ImageUrl[index]);
      }
    }
    DeleteImagesAndVideos(ExmpImage,[]);
  }else{
    var ExmpImage = [];
    var ExmpVideo = [];
    var size = ImageUrl.length>VideoUrl.length?ImageUrl.length:VideoUrl.length;
    for (let index = 0; index < size; index++) {
        if(obj.ImageUrl.includes(ImageUrl[index])&&ImageUrl.length>i){
          ExmpImage.push(ImageUrl[index]);
        }
        if(obj.VideoUrl.includes(VideoUrl[index])&&VideoUrl.length>i){
          ExmpVideo.push(VideoUrl[index])
        }
    }
    DeleteImagesAndVideos(ExmpImage,ExmpVideo);
  }
  
}
//删除图片和视频(如果当前删除错误,不会影响程序往下进行,这样会非常节省时间,不用判断,只用一个循环就可以解决)
function DeleteImagesAndVideos(ImageUrl,VideoUrl){
      if(ImageUrl.length>VideoUrl.length?ImageUrl.length:VideoUrl.length==0){
        return
      }
       //ImageUrl.length>VideoUrl.length?ImageUrl.length:VideoUrl.length 选择一个最大的长度,这样就能保证不会少删
       for (let index = 0; index < ImageUrl.length>VideoUrl.length?ImageUrl.length:VideoUrl.length; index++) {
            //视频的链接,不一定所有类型都有
            if(VideoUrl.length>0&&VideoUrl.length>i){
              wx.cloud.deleteFile({
                fileList: [VideoUrl[i]],
                success: res => {
                },
              })
            }
            wx.cloud.deleteFile({
              fileList: [ImageUrl[i]],
              success: res => {
              },
            })
      }
}

function Add(obj,dbname){
    var db = wx.cloud.database.collection(dbname);
    db.add({
        data: obj
    }).then(res=>{
        wx.showToast({
            title: '上传成功!',
            icon: 'none',
            duration: 1500
          })
    }).catch(err=>{
        wx.showToast({
            title: '中奖了,请再试一次',
            icon: 'none',
            duration: 1500
          })
    })
}
//生成当前时间
function GenerateTime() {
    return new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds();
}
//生成用户的ID
function generateUuid(length = 6) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

//上传图片
function Choiceimage(ImageUrl) {
    if (ImageUrl.length > 4) {
      wx.showToast({
        title: '图片只能上传五张!',
        icon: 'none',
        duration: 1500
      })
      return
    }
    var timestamp = (new Date()).valueOf();
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        ImageUrl.push("cloud://banliao-7gsuhw7baeb7dae3.6261-banliao-7gsuhw7baeb7dae3-1316386291/static/Images/" + timestamp + '.png')
        wx.cloud.uploadFile({
          cloudPath: ImageUrl[length-1],
          filePath: res.tempFilePaths[0],
          success(res) {
            wx.showToast({
                title: '上传成功!',
                icon: 'none',
                duration: 1500
              })
          },
          fail(res) {
            wx.showToast({
              title: '上传失败!',
              icon: 'none',
              duration: 1500
            })
          }
        })
      }
    })
    return ImageUrl
}
//上传视频
function ChooseVidoe(VideoUrl) {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        if (res.size > 1024 * 1024 * 10) {
          wx.showToast({
            title: '当前视频的大小不能大于10MB',
          })
          return
        } else {
          var temp = res.tempFilePath.split("/")[2]
          VideoUrl.push(temp)
          wx.cloud.uploadFile({
            cloudPath: "cloud://banliao-7gsuhw7baeb7dae3.6261-banliao-7gsuhw7baeb7dae3-1316386291/static/Videos/" + temp,
            filePath: res.tempFilePath,
            success(res) {
              wx.showToast({
                title: '上传成功了',
              })
            }, fail(res) {
              
              wx.showToast({
                title: '视频上传失败了,请在试一次',
              })
            }
          })
        }
      }, fail(res) {
        console.log("上传失败,请重试")
        console.log(res)
      }
    })
    return VideoUrl
}
function UpdateByMangr(id,dbname,judge) {
    var db = wx.cloud.database.collection(dbname);
    db.doc(id).update({
      data: {
        State: judge,
      }, success(res) {
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000//持续的时间
        })
      }
    })
}
