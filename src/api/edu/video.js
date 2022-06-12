import request from "../../utils/request";
export default {
  //添加小节信息
  addVideo(video){
    return request({
      url: '/eduservice/edu-video/addVideo',
      method: 'post',
      data: video
    })
  },
  //删除小节
  deleteVideo(id){
    return request({
      url: `/eduservice/edu-video/deleteVideo/${id}`,
      method: 'delete'
    })
  },
  //修改小节
  updateVideo(video){
    return request({
      url: '/eduservice/edu-video/updateVideo',
      method: 'post',
      data: video
    })
  },
  //根据小节id查询
  getVideoById(id){
    return request({
      url: '/eduservice/edu-video/getVideo/' + id,
      method: 'get'
    })
  }
}
