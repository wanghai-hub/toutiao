<template>
  <div class='edit'>
     <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号:">{{userInfo.id}}</el-form-item>
            <el-form-item label="手机:">{{userInfo.mobile}}</el-form-item>
            <el-form-item label="媒体名称:">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体简介:">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="userInfo.info">
              </el-input>
            </el-form-item>
            <el-form-item label="服务邮箱:">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" @click="updateuser">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <el-col :span="12">
          <el-upload
            class="avatar-uploader"
            action="https://ttapi.research.itcast.cn/mp/v1_0/user/photo"
            :show-file-list="false"
            :http-request="changePhoto">
            <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p>修改头像</p>
        </el-col>

      </el-row>
     </el-card>
  </div>
</template>

<script>
import eventbus from '../util/eventbus'
import auth from '../api/auth'
export default {
    data() {
        return {
          userInfo: {
            name: '',
            info: '',
            email: '',
            photo: ''
          },
          headers:{
            Authorization: `Bearer ${auth.getuser().token}`
          }
          // imageUrl: null
        }
    },
    created () {
      this.getuserinfo()
    },
    methods: {
      async changePhoto (param) {
        const fd = new FormData()
        fd.append('photo',param.file)
        const {data: {data}} = await this.$http.patch(`user/photo`,fd)
        //  本地预览
        this.userInfo.photo = data.photo
        // home组件传递
        eventbus.$emit('updatePhoto',data.photo)
        //  本地修改
        const user = auth.getuser()
        user.photo = data.photo
        auth.setuser(user)
      },
      async updateuser() {
        const {name ,info,email} = this.userInfo
        await this.$http.patch(`user/profile`, {
           name, info , emial
        })
        this.$message.success('修改用户信息成功')
       // 同步到home组件
       eventbus.$emit('toHome',name)
       // 同步本地存储
       const user = auth.getuser()
       user.name = name
       auth.setuser(user)
      },
      async getuserinfo() {
        const {data: {data}} = await this.$http.get(`user/profile`)
        this.userInfo = data
      }
    }
}
</script>

<style scoped lang='less'></style>