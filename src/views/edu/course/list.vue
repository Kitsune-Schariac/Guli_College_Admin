<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="eduCourseVo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="eduCourseVo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="eduCourseVo.title" placeholder="课程标题"/>
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select
          v-model="eduCourseVo.teacherId"
          placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="eduCourseVo.status"
          clearable
          placeholder="发布状态"
        >
          <el-option
            v-for="item in statusMap"
            :key = "item.value"
            :label = "item.label"
            :value = "item.value"
          >
            <span style="float: left">{{item.label}}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{item.value}}</span>
          </el-option>
<!--          <el-option :value="true" label="已发布"/>-->
<!--          <el-option :value="false" label="未发布"/>-->
        </el-select>
      </el-form-item>


      <el-button type="primary" icon="el-icon-serch" @click="getCoursePage(1)"
      >查询
      </el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- <el-table
      v-Loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    > -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      row-class-name="myClassList">


      <el-table-column label="序号" width="70" align="center">

        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="scope.row.title" width="150px">
            </div>
            <div class="title">
              <a href="">{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }}</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate.substr(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.gmtModified.substr(0, 10) }}
        </template>
      </el-table-column>

      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          {{ Number(scope.row.price) === 0 ? '免费' : '￥' + scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column label="付费学员" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.buyCount }}人
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑课程信息
            </el-button
            >
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑课程大纲
            </el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCourse(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getCoursePage"
    />
  </div>
</template>

<script>
// 引入teacehr.js文件
import teacher from "@/api/teacher/teacher";
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";

export default {
  // 核心代码的书写位置
  // data: {

  // },
  data() {
    //定义变量和初始值
    return {
      list: null, //查询之后接口返回集合
      page: 1, //当前页
      limit: 10, //页面记录数
      total: 0, //总记录数
      teacherList: [

      ],    //所有的讲师
      eduCourseVo: {
        //条件封装对象
        status: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        title: ''
      },
      statusMap: [
        {
          value: 'Normal',
          label: '已发布'
        },
        {
          value: 'Draft',
          label: '未发布'
        }
      ],
      //课程分类信息
      subjectOneList: [

      ],
      //课程二级分类信息
      subjectTwoList: [

      ],
    };
  },
  created() {
    //在页面渲染之前执行，一般调用methods中定义的方法
    //调用
    // this.getList();
    this.allTeacher();//初始化所有讲师
    // this.allList(); //初始化所有数据(临时)
    this.getCoursePage(); //初始化页面数据
    this.getSubjectList(); //初始化课程分类信息

  },
  methods: {
    //获取所有数据
    allList(){
      course
        .allCourse()
        .then((response) => {
          this.list = response.data.list
        })
    },
    //获取所有讲师
    allTeacher(){
      course.getListTeacher()
        .then((response) => {
          this.teacherList = response.data.items
        })
    },
    //删除课程
    deleteCourse(id){
      this.$confirm('确认要删除课程吗','警告',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.deleteLogic(id)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getCoursePage(this.page)
          })
      })
    },
    //调用分页查询的方法
    getCoursePage(page = 1){
      console.log(page)
      this.page = page
      course
        .coursePageCondition(this.page, this.limit, this.eduCourseVo)
        .then((response) => {
          this.list = response.data.rows;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.log(error)
        })
    },
    resetData() {
      // 首先把表单输入项数据清空
      this.eduCourseVo = {};

      // 查询所有讲师的数据
      this.getList();
      //重新初始化分类
      this.getSubjectList();
      //初始化二级分类
      this.subjectTwoList = null;
    },
    // 删除讲师的方法
    removeDataById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {//调用删除方法
          teacher.removeById(id).then((response) => {
            this.getList(this.page);
            this.$message({
              type: "success",
              message: "删除成功!",
            })
            // .catch((error) => {
            //   console.log(error);
            // });
          });
        })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除",
      //   });
      // });
    },
    //获取课程分类
    getSubjectList(){
      subject.getSubjectList()
        .then((res) => {
          this.subjectOneList = res.data.list
        })
    },
    //切换一级分类
    subjectLevelOneChanged(value){
      for(let i = 0 ; i < this.subjectOneList.length ; i++){
        //每个一级分类
        let oneSubject = this.subjectOneList[i]
        if(value === oneSubject.id){
          //从一级分类中取出二级分类
          this.subjectTwoList = oneSubject.children
        }
      }
      //切换一级分类之后清空二级分类的选中
      this.eduCourseVo.subjectId = ''

    }
  },
};
</script>

<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}
.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}
.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.myClassList .info .pic img {
  display: block;
  width: 100%;
}
.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}
.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}
.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>
