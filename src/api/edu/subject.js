import request from '@/utils/request'
export default{
    //1 课程分类列表
    getSubjectList() {
        return request({
            // url: '/table/list'+current+"/"+limit,
            url: '/eduservice/edu-subject/getAllSubject',
            method: 'get',
            // params
            // eduTeacherVo条件对象，后端用requestBody获取数据
            // data表示把对象转换成json传到后端接口
        })
    }
}