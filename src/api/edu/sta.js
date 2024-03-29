import request from "../../utils/request";
export default {
  //1生成统计数据
  createStaData(day){
    return request({
      url: '/staservice/statistics-daily/registerCount/' + day,
      method: 'post'
    })
  },
  //获取统计数据
  getDataSta(searchObj) {
    return request({
      url: `/staservice/statistics-daily/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}
