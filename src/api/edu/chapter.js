import request from '@/utils/request'
export default {

  //1 根据课程id获取章节和小节数据列表
  getChapterVideoByCourseId(courseId){
    return request ({
      url: `/eduservice/edu-chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },

  //修改章节内容
  updateChapter(chapter){
    return request({
      url: '/eduservice/edu-chapter/updateChapter',
      method: 'post',
      data: chapter
    })
  },

  //删除章节
  deleteChapterById(chapterId){
    return request({
      url: '/eduservice/edu-chapter/deleteChapter/' + chapterId,
      method: 'delete'
    })
  },

  //根据id查询章节
  getChapterById(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterById/${chapterId}`,  //换种写法，换个心情 笑
      method: 'get'
    })
  },

  //添加章节
  addChapter(chapter) {
    return request({
      url: '/eduservice/edu-chapter/addChapter',
      method: 'post',
      data: chapter
    })
  }

}
