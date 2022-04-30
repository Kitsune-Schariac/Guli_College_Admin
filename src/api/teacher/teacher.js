import request from '@/utils/request'
import url from 'postcss-url'

export default{

    //1讲师列表（条件查询分页)
    //current当前页 limit每页记录数 eduTeacehrVo条件对象
    getTeacherListPage(current, limit, eduTeacherVo){
        return request({
            // url: '/table/list'+current+"/"+limit,
            url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // params
            // eduTeacherVo条件对象，后端用requestBody获取数据
            // data表示把对象转换成json传到后端接口
            data: eduTeacherVo
        })
    },

    // 2删除讲师
    removeById(id){
        return request({
            url:`/eduservice/edu-teacher/delete/${id}`,
            method: 'delete'
        })
    },

    // 3添加讲师
    addTeacher(teacher){
        return request({
            url:`/eduservice/edu-teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },


    getTeacherInfo(id) {
        return request({
            url: `/eduservice/edu-teacher/getTeacher/${id}`,
            method: 'post'
        })
    },
    
    // 修改讲师
    updateTeacher(teacher) {
        return request({
            url:`/eduservice/edu-teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }

}

// export function getList(params) {
//     return request({
//       url: '/table/list',
//       method: 'get',
//       params
//     })
//   }
  