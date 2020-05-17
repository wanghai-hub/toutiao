<template>
  <div class='MyCover'>
       <div class="btn_img" @click="openDialog()">
         <!-- 保证父组件传入图片地址没有的话，显示默认图 -->
         <!-- 父组件是无图就显示自己的图片 -->
         <img :src="value || coverImageUrl" />
      </div>

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="720px">
       <!-- tab组件 -->
         <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="素材库" name="img">
                <!-- 切换按钮 -->
                <el-radio-group @change="changeCollect" v-model="reqParams.collect" size="small">
                    <el-radio-button :label="false">全部</el-radio-button>
                    <el-radio-button :label="true">收藏</el-radio-button>
                </el-radio-group>
                 <!-- 素材列表 -->
                <div class="img_list">
                    <div
                    :class="{selected: item.url === selectedImageUrl}"
                    @click="selectedImage(item.url)"
                    class="img_item"
                    v-for="item in images"
                    :key="item.id">
                    <img :src="item.url">
                    </div>
                </div>
                 <!-- 分页组件 -->
                <el-pagination
                    background
                    layout="prev, pager, next"
                    hide-on-single-page
                    @current-change="changePager"
                    :page-size="reqParams.per_page"
                    :current-page="reqParams.page"
                    :total="total">
                </el-pagination>
            </el-tab-pane>

            <el-tab-pane label="上传图片" name="upload">
                <el-upload
                    class="avatar-uploader"
                    action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                    name="image"
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="uploadSuccess">
                    <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-tab-pane>
        </el-tabs>

         <span slot="footer" class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="confirmImage()">确 定</el-button>
         </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImg from '@/assets/default.png'
import auth from '../api/auth'
export default {
    name: 'MyCover',
    props: ['value'],
    data() {
        return {
            uploadImageUrl: null, //上传预览图片
            images: [],
            total: 0,
            coverImageUrl: defaultImg, // 默认预览图片的地址
            dialogVisible: false, //弹出对话框显示
            activeName: 'img',
            reqParams: {
                collect: false,
                page: 1,
                per_page: 8
            },           
            selectedImageUrl: null, // 选中的图片地址
            headers: {
                Authorization: `Berare ${auth.getuser().token}`
            }
        }
    },
    methods: {
        //上传成功
        uploadSuccess(res) {
             this.uploadImageUrl = res.data.url
        },
        // 收藏和全部切换
        changeCollect() {
            this.reqParams.page = 1
            this.getimages()
        },
        // 打开对话框
        openDialog() {
            // 再次打开对话框,重置数据
            this.selectedImageUrl = null
            this.uploadImageUrl = null
            this.activeName = 'image'

            this.dialogVisible= true
            this.getimages()
        },
        // 获取素材列表
        async getimages() {
            const {data: {data}} = await this.$http.get('user/images',{params: this.reqParams} )
            this.images = data.results
            this.total = data.total_count
        },
        // 选择图片
        selectedImage(url) {
            this.selectedImageUrl = url
        },
        // 切换分页时
        changePager(newpage) {
            this.reqParams.page = newpage
            this.getimages()
        },
        //点击确认上传/收藏按钮
        confirmImage() {
            if (this.activeName === 'image') {
                if (!this.selectedImageUrl) {
                    return this.$message.warning('收藏请先选中一张图片')
                    }
                // this.coverImageUrl =  this.selectedImageUrl
                //点击确认之后，将新的图片交给父组件显示预览
                this.$emit('input',this.selectedImageUrl)
            
            }
            if (this.activeName === 'upload') {
                 if (!this.uploadImageUrl) {
                    return this.$message.warning('请先上传一张图片')
                    }
                // this.coverImageUrl = this.uploadImageUrl
                this.$emit('input',this.uploadImageUrl)
            }

             this.dialogVisible = false
        }
    }
}
</script>

<style scoped lang='less'>
.btn_img {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
// 素材列表
.img_list{
  margin-top: 15px;
  .img_item{
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    // 给.img_item加上一个类.selected
    // 这个类上包含一个::after的伪元素
    // &在less中表示作用：连接符
    // .a{.b{}}  ===> .a .b{}  后代选择器
    // .a{&.b{}} ===> .a.b{} 交集选择器
    // 解析后：.img_list.selected::after{}  目标
    &.selected::after{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.3) url(../assets/selected.png) no-repeat center / 50px 50px;
    }
  }
}
</style>