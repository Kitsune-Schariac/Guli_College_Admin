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
        <el-select v-model="courseInfo.subjectParentId" placeholder="一级分类">
          <el-option
            v-for = "subject in subjectOneList"
            :key = "subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>


      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for = "teacher in teacherList"
            :key = "teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <el-input v-model="courseInfo.description" placeholder=" "/>
      </el-form-item>


      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面" hidden="true">

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
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from "@/api/edu/subject";
export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '',  //二级分类id
        subjectParentId: '',  //一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '',
        price: 0
      },
      //封装所有的讲师
      teacherList: [

      ],
      //封装所有的课程一级分类
      subjectOneList: [

      ],
      //二级分类
      subjectTwoList: [

      ]
    }
  },
  created() {
    //初始化所有讲师
    this.getListTeacher()
    //初始化一级分类
    this.getOneSubject()

  },
  methods: {
    saveOrUpdate(){
      course.addCourseInfo(this.courseInfo)
        .then(response => {
          //提示
          this.$message({
            type: "success",
            message: "保存成功!",
          })
          //跳转到第二步
          this.$router.push({path : '/course/chapter/'+response.data.courseId})
        })

    },
    //查询所有的讲师
    getListTeacher(){
      course.getListTeacher()
        .then(response => {
          this.teacherList = response.data.items
        })
    },
    //查询所有的一级课程分类
    getOneSubject(){
      subject.getSubjectList()
        .then(response => {
          this.subjectOneList = response.data.list
        })
    }
  }
}
</script>
