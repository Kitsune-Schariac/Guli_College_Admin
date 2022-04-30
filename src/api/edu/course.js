import request from '@/utils/request'
export default {
  //1添加课程信息
  addCourseInfo(courseInfo){
    return request ({
      url: '/eduservice/edu-course/addCourseInfo',
      method: 'post',
      data : courseInfo
    })
  }
}
