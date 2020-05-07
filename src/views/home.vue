<template>
    <el-container class="home">
      <!-- 侧边栏 -->
      <el-aside :width="!isCollapse?'200px':'64px'" class="my-aside">
        <div class="logo" :class="{minLogo:isCollapse}"></div>
         <el-menu
            router
            :collapse-transition="false"
            :collapse="isCollapse"
            style="border:0"
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#002233"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="/home">
              <i class="el-icon-setting"></i>
              <span slot="title">首页</span>
            </el-menu-item>
             <el-menu-item index="/article">
              <i class="el-icon-setting"></i>
              <span slot="title">内容管理</span>
            </el-menu-item>
            <el-menu-item index="/img">
              <i class="el-icon-setting"></i>
              <span slot="title">素材管理</span>
            </el-menu-item>
            <el-menu-item index="/publish">
              <i class="el-icon-setting"></i>
              <span slot="title">发布文件</span>
            </el-menu-item>
            <el-menu-item index="/comment">
              <i class="el-icon-setting"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>
             <el-menu-item index="/fans">
              <i class="el-icon-setting"></i>
              <span slot="title">粉丝管理</span>
            </el-menu-item>
             <el-menu-item index="/self">
              <i class="el-icon-setting"></i>
              <span slot="title">个人管理</span>
            </el-menu-item>
         </el-menu>
      </el-aside>
          
      <!-- 右侧显示 -->
      <el-container>
        <!-- 头 -->
        <el-header class="my-header">
          <i class="el-icon-s-fold" @click="toggle"></i>
         <span class="text">江苏传智播客</span>
         <el-dropdown class="my-dropdown">
          <span class="el-dropdown-link">
            <img :src="userphoto" class="user-avatar">
            <span class="user-name">{{username}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="edituser">个人设置</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </el-header>
        <!-- 展示 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
import auth from '../api/auth'
export default {
    name: 'home',
    data() {
      return {
        isCollapse: false,
        username: '',
        userphoto: ''
      }
    },
    created() {
      const user = auth.getuser()
      this.username = user.name
      this.photo = user.photo
    },
    methods: {
      toggle() {
        this.isCollapse = !this.isCollapse
      },
      edituser() {
        this.$router.push('/setting')
      },
      logout() {
        auth.deletuser()
        this.$router.push('/login')
      }
    }
}
</script>

<style scoped lang='less'>
.home {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .my-aside {
    background: #002233;
    .logo{
      width: 100%;
      height: 60px;
      background: #002244 url(../assets/logo_admin.png) no-repeat center / 140px auto;
    }
    // 覆盖background 的图片和大小，类书写在logo的下方。
    .minLogo{
      background-image: url(../assets/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .my-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 24px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      padding-left: 10px;
    }
    .my-dropdown {
      float: right;
      .user-avatar{
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .user-name{
        font-weight: bold;
        vertical-align: middle;
        padding-left: 5px;
      }
    }
  }
}
</style>