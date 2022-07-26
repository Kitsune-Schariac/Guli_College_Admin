<template>

  <div class="app-container">
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!--      <el-form-item label="课程分类" hidden="true">-->
      <!--        <el-select-->
      <!--          v-model="courseInfo.subjectParentId"-->
      <!--          placeholder="一级分类" @change="subjectLevelOneChanged">-->

      <!--          <el-option-->
      <!--            v-for="subject in subjectOneList"-->
      <!--            :key="subject.id"-->
      <!--            :label="subject.title"-->
      <!--            :value="subject.id"/>-->

      <!--        </el-select>-->

      <!--        &lt;!&ndash; 二级分类 &ndash;&gt;-->
      <!--        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">-->
      <!--          <el-option-->
      <!--            v-for="subject in subjectTwoList"-->
      <!--            :key="subject.id"-->
      <!--            :label="subject.title"-->
      <!--            :value="subject.id"/>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->

      <!--      课程分类-->
      <el-form-item label="课程分类">
        <el-select v-model="courseInfo.subjectParentId" placeholder="一级分类" @change="subjectLevelOneChange">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" class="tinymce-container"/>
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
import Tiny from '@/components/Tinymce/index'

export default {
  // 声明组件
  components: {
    // Tinymce
    Tinymce
  },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '', // 二级分类id
        subjectParentId: '', // 一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://edu-guli-kitsune.oss-cn-chengdu.aliyuncs.com/2022/03/06/7c67c19b699a419982c1080839eb7340file.png',
        price: 0,
        courseId: ''
      },
      // 封装所有的讲师
      teacherList: [],
      // 封装所有的课程一级分类
      subjectOneList: [],
      // 二级分类
      subjectTwoList: [],
      BASE_API: process.env.BASE_API, // 接口API地址
      editorConfig: {
        language: 'zh_CN',
        language_url: 'tinymce/zh_CN.js'
      }
    }
  },
  watch: {
    // 监听
    $route(to, from) {
      // 路由变化方式
      console.log('witch $route')
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 获取路由中的id值
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        console.log(this.courseId + 'hello')
        this.getCourseInfo()
      } else {
        this.courseInfo.title = ''
        this.courseInfo.subjectId = ''
        this.courseInfo.subjectParentId = ''
        this.courseInfo.teacherId = ''
        this.courseInfo.lessonNum = 0

        this.courseInfo.cover = 'https://edu-guli-kitsune.oss-cn-chengdu.aliyuncs.com/2022/03/06/7c67c19b699a419982c1080839eb7340file.png'
        this.courseInfo.price = 0
        this.courseInfo.courseId = ''
        // todo 富文本编辑器无法清空 2022年6月8日20:44:03 @kitsune
        // Tinymce.setContent(' ');
        this.courseInfo.description = ''
      }

      console.log('init')
      // 初始化所有讲师
      this.getListTeacher()
      // 初始化一级分类
      this.getOneSubject()
      // 初始化二级分类
      // this.getTwoSubject()
    },
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          // 提示
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          // 跳转到第二步
          this.$router.push({path: '/course/chapter/' + response.data.courseId})
        })
    },
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then(response => {
          // 提示
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          // 跳转到第二步
          this.$router.push({path: '/course/chapter/' + this.courseInfo.id})
        })
    },
    saveOrUpdate() {
      if (this.courseInfo.id != null) {
        this.updateCourse()
      } else {
        this.addCourse()
      }
    },
    // 查询所有的讲师
    getListTeacher() {
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },

    // 查询所有的一级课程分类
    getOneSubject() {
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list
        })
    },
    // 当点击某个一级分类，就触发这个事件，显示对应的二级分类
    subjectLevelOneChange(value) {
      //  这里的value就是一级分类的id值
      //   alert(value)
      for (let i = 0; i < this.subjectOneList.length; i++) {
        // 每个一级分类
        var oneSubject = this.subjectOneList[i]
        // 判断
        if (value === oneSubject.id) {
          // 从一级分类中获取二级分类
          this.subjectTwoList = oneSubject.children
        }
      }
      // 切换其他一级分类的时候清空二级分类的内容
      this.courseInfo.subjectId = ''
    },
    // 上传封面成功调用的方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLT2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是jpg或png格式')
        this.courseInfo.cover = 'https://edu-guli-kitsune.oss-cn-chengdu.aliyuncs.com/2022/03/06/7c67c19b699a419982c1080839eb7340file.png'
      }
      if (!isLT2M) {
        this.$message.error('上传图片不能大于2MB')
        this.courseInfo.cover = 'https://edu-guli-kitsune.oss-cn-chengdu.aliyuncs.com/2022/03/06/7c67c19b699a419982c1080839eb7340file.png'
      }
    },
    // 根据id查询课程信息
    getCourseInfo() {
      course.getCourseInfoId(this.courseId)
        .then(res => {
          this.courseInfo = res.data.courseInfoVo
          // 查询所有分类
          subject.getSubjectList()
            .then(response => {
              // 获取所有一级分类
              this.subjectOneList = response.data.list
              // 把所有一级分类数组进行遍历
              for (var i = 0; i < this.subjectOneList.length; i++) {
                var subjectOne = this.subjectOneList[i]
                if (this.courseInfo.subjectParentId == subjectOne.id) {
                  // 取出这个一级分类的二级分类，就做到了数据回显
                  this.subjectTwoList = subjectOne.children
                }
              }
              this.getListTeacher()
            })
        })
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
