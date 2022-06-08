import request from '@/utils/request'
export default {
  //1添加课程信息
  addCourseInfo(courseInfo){
    return request ({
      url: '/eduservice/edu-course/addCourseInfo',
      method: 'post',
      data : courseInfo
    })
  },
  //2查询所有讲师
  getListTeacher(){
    return request ({
      url: '/eduservice/edu-teacher/find',
      method: 'get'
    })
  },
  //根据id查询课程信息
  getCourseInfoId(id) {
    return request ({
      // url: `/eduservice/edu-course/${id}`,
      url: '/eduservice/edu-course/CourseInfo/' + id, //换个写法，换个心情（笑）
      method: 'get'
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfo){
    return request ({
      url: '/eduservice/edu-course/updateCourseInfo',
      method: 'post',
      data : courseInfo
    })
  },
}
