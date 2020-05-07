<template>
  <div class='login-container'>
      <el-card class="box-card">
          <img src="../assets/logo_index.png">
          <el-form ref="form" :model="LoginForm" :rules="rules" status-icon>
              <el-form-item prop="mobile">
                 <el-input v-model="LoginForm.mobile" placeholder="输入手机号"></el-input>
              </el-form-item>
              <el-form-item prop="code">
                  <el-input v-model="LoginForm.code" placeholder="输入验证码"
                  style="width:70%;margin-right:20px"
                  ></el-input>
                   <el-button type="primary">验证码</el-button>
              </el-form-item>
              <el-form-item >
                   <el-checkbox :value="true">我已统一以上所有条款</el-checkbox>
              </el-form-item>
              <el-form-item >
                   <el-button type="primary" style="width:100%"
                     @click="submitForm()"
                   >登 陆</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
import auth from '../api/auth'
export default {
    name: 'login',
    data() {
        const mobileFn = (rule,val,callback) => {
            if(/^1[3-9]\d{9}$/.test(val)) {
                callback()
            }else {
                new Error('手机号格式不对')
            }
        };
        return {
            LoginForm: {
                code: '246810',
                mobile: '13911111111'
            },
            rules: {
                mobile: [
                    { required: true, message: '请输入手机好吗', trigger:'blur'},
                     { validator: mobileFn, trigger: 'blur'}
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger:'blur'},
                    { len:6, message: '长度是6位',trigger: 'blur'}
                ]
            }
        } 
    },
   methods: {
       async submitForm() {
        //    this.$refs.form.validate((valid) => {
        //        if(valid) {
        //            // 校验成功 发请求登陆
        //          this.$http.post('authorization',this.LoginForm).then(
        //              (res) => {
        //                  auth.setuser(res.data.data)
        //                  this.$router.push('/')
        //              } 
        //          ).catch(() => {console.log('登陆失败');
        //          })
        //        }
        //    })
            this.$refs.form.validate( (valid) => {
                if(valid) {
                  try{
                        const res = await this.$http.post('authorization',this.LoginForm)
                        auth.setuser(res.data.data)
                        this.$router.push('/')
                  }catch(e){
                      this.$message.error('手机号错')
                  }
                }
            })
       }
   }
}
</script>

<style scoped lang='less'>
.login-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:url(../assets/login_bg.jpg) no-repeat center/cover
}
.box-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-60%);
    img {
        display: block;
        width: 200px;
        margin: 0 auto;
        margin-bottom: 20px;
    }
}
</style>