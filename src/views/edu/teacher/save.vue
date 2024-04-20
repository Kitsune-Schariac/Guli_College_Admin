<template>
  <div class="app-container">
    讲师添加
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>

      <el-form-item label="等级">
        <el-select placeholder="请选择讲师职称等级" v-model="teacher.level">
          <el-option label="高级讲师" :value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资历">
        <el-input v-model="teacher.career" />
      </el-form-item>

      <el-form-item label="简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image=String(teacher.avatar) />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调
        <input type="file" name="file"/>
      -->
              <image-cropper
                v-show="imagecropperShow"
                :width="300"
                :height="300"
                :key="imagecropperKey"
                :url="BASE_API + '/eduoss/fileoss'"
                field="file"
                @close="close"
                @crop-upload-success="cropSuccess"
              />
      </el-form-item>

      <!-- <el-form-item label="头像">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from "@/api/teacher/teacher";
import ImageCropper from '@/components/ImageCropper';
import PanThumb from '@/components/PanThumb';

export default {
  components: {ImageCropper, PanThumb},
  data() {
    return {
      teacher: {
        name: "",
        intro: "",
        career: "",
        level: 1,
        avatar: "https://private-kitsune.oss-cn-chengdu.aliyuncs.com/2022/02/27/f1c5c7dd78b747edb07353ee97fd24d9file.png",
        // 这里如果不写具体的字段会自动生成
      },

      imagecropperShow:false,  //上传弹框组件是否显示
      imagecropperKey:0,//上传组件key值（唯一标识)
      BASE_API:process.env.BASE_API, //获取dev.env.js里面的地址
      saveBtnDisabled:false //保存按钮是否禁用

    };
  },

  created() {
    this.init();
  },
  watch: {
    //监听
    $route(to, from) {
      //路由变化方式
      console.log("wtch $route");
      this.init();
    },
  },

  methods: {

    // 关闭上传弹框的方法
    close(){
      this.imagecropperShow = false;
      // 上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    // 上传成功的方法
    cropSuccess(data){
      this.imagecropperShow = false;
      // 上传之后接口返回图片地址
      this.teacher.avatar = data.url;

      this.imagecropperKey = this.imagecropperKey + 1;
    },

    init() {
      // 先判断路径里面是否有id值
      if (this.$route.params && this.$route.params.id) {
        // 从路径获取id值
        const id = this.$route.params.id;
        // 调用拉取数据的方法
        console.log("id", id);
        this.getTeacherInfo(id);
      } else {
        this.teacher = {};
        this.teacher.avatar = 'https://private-kitsune.oss-cn-chengdu.aliyuncs.com/2022/02/27/f1c5c7dd78b747edb07353ee97fd24d9file.png'
      }
    },
    saveOrUpdate() {
      // 根据teacher对象里面是否有id进行判断
      // 有id就是修改，没有就是添加
      if (!this.teacher.id) {
        this.saveTeacher();
      } else {
        this.updateTeacher(this.teacher);
      }
    },

    //   添加讲师的方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((response) => {
        // 提示信息
        this.$message({
          type: "success",
          message: "添加成功",
        });
        // 回到列表页面 路由跳转
        this.$router.push({ path: "/edu/teacher/list" });
      });
    },

    // 根据讲师id查询数据
    getTeacherInfo(id) {
      teacherApi.getTeacherInfo(id).then((response) => {
        this.teacher = response.data.teacher;
      });
    },

    // 修改讲师信息
    updateTeacher(teacher) {
      teacherApi.updateTeacher(teacher).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功",
        });
        // 回到列表页面 路由跳转
        this.$router.push({ path: "/edu/teacher/list" });
      });
    },
  },
};
</script>
