import { formatTime } from '../pages/order/after-service-detail/api';
//在init函数最后添加上去 
if (wx.getStorageSync('Id') == null) {
        wx.setStorageSync('Id', this.generateUuid(6));
        var _id = formatTime(new Date()) + "BANLIAO";
        var obj = {
          _id: _id,
          Id: wx.getStorageSync('Id'),
        }
        wx.cloud.database().collection("User").add({
          data: obj         
        }).then(res => { }).catch(error => {
          console.log("当前调用错误", error)
        })
      } 
else {
             
}