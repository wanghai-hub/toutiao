<template>
  <div class='imgs'>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
        <!-- 按钮栏 -->
        <div style="margin-top: 20px">
            <el-radio-group v-model="reqParams.collect" size="small"
            @change="changeCollect()"
            >
             <el-radio-button :label="false" >全部</el-radio-button>
             <el-radio-button :label="true" >收藏</el-radio-button>
            </el-radio-group>
            <el-radio-button type="success" style="float:right"
            @click="add"
            >添加素材</el-radio-button>
        </div>
        <!-- 图片列表 -->
        <div class="img_list">
            <div class="img_item" v-for="item in images" :key="item.id">
            <img :src="item.url"  />
              <div class="option" v-if="!reqParams.collect">
                <span  class="el-icon-star-off" @click="toggleCollect(item)"
                  :style="{color:item.is_collected?'red':'#fff'}"></span>
                <span class="el-icon-delete" @click="remove(item.id)"></span>
              </div>
            </div>
        </div>
        <!-- 分页 -->
        <el-pagination
            background
            layout="prev, pager, next"
            @current-change="changePager"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            :total="total"
        ></el-pagination>

        <!-- 对话框 -->
        <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
          <span>
              <el-upload
                class="avatar-uploader"
                action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                name="image"
                :headers="headers"
                :on-success="handleAvatarSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
          </span>
        </el-dialog>

    </el-card>
  </div>
</template>

<script>
import auth from '@/api/auth.js'
export default {
    data() {
        return {
            reqParams: {
                collect: false, //判断是全部还是收藏
                page: 1, //当前页码
                per_page: 10,
            },
            images: [], // 图片列表
            total: 0,
            dialogVisible: false,
            headers: {
                Authorization:  `Berare ${auth.getuser().token}`
            },
            imageUrl: null
        }
    },
    created() {
        this.getimages()
    },
    methos: {
        handleAvatarSuccess(res) {
            this.imageUrl = res.data.url
            var that = this
            window.setTimeout( () => {
                that.dialogVisible = false
                that.reqParams.page = 1
                that.getimages()
                this.imageUrl = null
            } ,3000)
        },
        // 打开添加素材对话框
        add() {
            this.dialogVisible = true
        },
        // 删除图片
        async remove(id) {
            await this.$http.delete(`user/images/${id}`)
            this.getimages() //重新渲染
        },
        async toggleCollect(item) {
            const {data: {data}} = await this.$http.put(`user/images/${item.id}`, {
                collect : !item.is_collected
            })
            this.is_collected = data.collect
        },
        // 切换收藏与全部按钮
        changeCollect() {
            this.reqParams.page = 1
            this.getimages()
        },
        // 获取图片列表并渲染
        async getimages() {
            const {data: {data}} = await this.$http.get( 'user/images', {params: this.reqParams} )
            this.images = data.results
        },
        // 切换分页执行
        changePager(newpage) {
            this.reqParams.page = newpage           
            this.getimages()
        },
    },
}
</script>

<style scoped lang='less'>
.img_list {
  margin-top: 20px;
  .img_item {
    width: 180px;
    height: 180px;
    border: 1px dashed #ddd;
    display: inline-block;
    position: relative;
    margin-right: 50px;
    margin-bottom: 15px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .option {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      width: 100%;
      color: #fff;
      span {
        margin: 0 30px;
      }
    }
  }
}

  
</style>