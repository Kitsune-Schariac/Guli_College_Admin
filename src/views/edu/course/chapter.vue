<template>


  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>

    <ul class="chanpterList">
      <!--      先遍历章节-->
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>
        <ul class="chanpterList videoList">
          <!--然后遍历小节-->
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
            </span>

            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">

      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>

    </el-form>

    <!-- 添加和修改章节表单 -->

    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label=1 >免费</el-radio>
            <el-radio :label=0 >默认(收费)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseId: '', //课程id
      chapterVideoList: [],
      dialogChapterFormVisible: false, //章节弹框
      chapter: {
        title: '',
        sort: 0,
        courseId: this.courseId

      },
      saveVideoBtnDisabled: false, //课时按钮是否禁用
      dialogVideoFormVisible: false, //小节信息弹框
      video: {
        title: '',
        sort: 0,
        courseId: this.courseId,
        chapterId: '',
        isFree: 0,
        videoSourceId: ''

      },

    }
  },
  created() {

    //获取路由中的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getAllChapterVideo()
    }


  },
  methods: {
    //===============================小节操作================================================================
    //删除小节
    deleteVideo(id){
      this.$confirm('此操作将删除小节信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        video.deleteVideo(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
            })
            this.getAllChapterVideo()
          })
      })


    },

    //添加小节
    addVideo(){
      this.video.id = null
      video.addVideo(this.video)
        .then(response => {
          //关闭弹窗
          this.dialogVideoFormVisible = false
          //提示信息
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          //刷新页面
          this.getAllChapterVideo()
        })
    },
    //修改小节
    updateVideo(){
      video.updateVideo(this.video)
        .then(response => {
          //关闭弹窗
          this.dialogVideoFormVisible = false
          //提示信息
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          //刷新页面
          this.getAllChapterVideo()
        })
    },
    saveOrUpdateVideo(){
      if(!this.video.id){
        this.addVideo()
      }else{
        this.updateVideo()
      }
    },
    //修改小节弹窗，数据回显
    openEditVideo(id){
      this.dialogVideoFormVisible = true
      video.getVideoById(id)
        .then((response) => {
          this.video = response.data.video
        })
    },

    //添加小节弹框的方法
    openVideo(chapterId){
      //弹框
      this.dialogVideoFormVisible = true;
      this.video.title = ''
      this.video.sort = 0
      this.video.free = false
      this.video.videoSourceId = ''
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId
      this.video.id = null
    },


    //++++++++++++++++++++++++++++章节操作++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    //删除章节
    removeChapter(id) {
      this.$confirm('此操作将删除章节信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapter.deleteChapterById(id)
          .then(response => {
            //提示信息
            this.$message({
              type: 'success',
              message: '删除章节成功',
            })
            //刷新页面
            this.getAllChapterVideo()
          })
      })


    },

    //修改章节
    updateChapter() {
      this.chapter.courseId = this.courseId
      chapter.updateChapter(this.chapter)
        .then(response => {
          //关闭弹窗
          this.dialogChapterFormVisible = false
          //提示信息
          this.$message({
            type: 'success',
            message: '修改章节信息成功',
          })
          //修改之后
          this.chapter.id = null
          //刷新页面
          this.getAllChapterVideo()
        })

    },

    //添加章节
    addChapter() {
      this.chapter.courseId = this.courseId
      this.chapter.id = null
      chapter.addChapter(this.chapter)
        .then(response => {
          //关闭弹窗
          this.dialogChapterFormVisible = false
          //提示信息
          this.$message({
            type: 'success',
            message: '添加成功',
          })
          //刷新页面
          this.getAllChapterVideo()
        })
    },

    saveOrUpdate() {

      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }

    },

    //根据课程id查询章节和小节的数据列表
    getAllChapterVideo() {
      chapter.getChapterVideoByCourseId(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.list;
          // console.log(this.chapterVideoList)
          // console.log(response.data.list)
        })
    },

    next() {
      //跳转到第二步
      this.$router.push({path: '/course/publish/' + this.courseId})
    },
    previous() {
      //跳转到第一步
      this.$router.push({path: '/course/info/' + this.courseId})
    },
    openChapterDialog() {
      this.chapter.title = ''
      this.chapter.sort = 0
      this.dialogChapterFormVisible = true
    },
    openEditChapter(chapterId) {
      //获取数据回显
      chapter.getChapterById(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
      //弹框
      this.dialogChapterFormVisible = true
    }
  }
}
</script>

<style scoped>

.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;

}


.chanpterList li {
  position: relative;

}


.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
  /*用对定位来定位p标签*/
  position: relative;

}


.chanpterList .acts {
  float: right;
  font-size: 14px;
  /*同样使用相对定位，index设置为1避免这个元素被p标签遮住*/
  position: relative;
  z-index: 1;

}


.videoList {
  padding-left: 50px;

}


.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;

}

</style>
