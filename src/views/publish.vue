<template>
  <div class='publish'>
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改文章':'发布文章'}}</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">

          <el-form-item label="标题">
            <el-input v-model="articleForm.title" 
            placeholder="请输入文章标题" style="width:400px"></el-input>
          </el-form-item>

          <el-form-item label="内容">
            <quill-editor v-model="articleForm.content" 
            :options="editorOption"> 
            </quill-editor>
          </el-form-item>

          <el-form-item label="封面">
              <!-- 单选狂组 -->
              <el-radio-group @change="articleForm.cover.images=[]" 
                v-model="articleForm.cover.type">
                 <el-radio :label="1">单图</el-radio>
                 <el-radio :label="3">三图</el-radio>
                 <el-radio :label="0">无图</el-radio>
                 <el-radio :label="-1">自动</el-radio>
             </el-radio-group>
             <!-- 使用封装好的封面图组件 -->
                <div style="margin-top:10px" v-if="articleForm.cover.type===1">
                    <my-cover v-model="articleForm.cover.images[0]"></my-cover>
                </div>
                <div style="margin-top:10px" v-if="articleForm.cover.type===3">
                    <my-cover style="display:inline-block;margin-right:15px"
                    v-model="articleForm.cover.images[i-1]"
                    v-for="i in 3" :key="i">
                    </my-cover>
                </div>
          </el-form-item>

          <el-form-item label="频道">
             <my-channel v-model="articleForm.channel_id"></my-channel>
          </el-form-item>

          <el-form-item v-if="$route.query.id">
            <el-button type="success" @click="updateArticle()">修改文章</el-button>
          </el-form-item>
          <el-form-item v-else>
            <el-button @click="addArticle(false)" type="primary">发布文章</el-button>
            <el-button @click="addArticle(true)">存入草稿</el-button>
          </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
    name: 'publish',
    components: {
        quillEditor
    },
    data() {
        return {
          // 富文本配置对象
          editorOption: {
                  placeholder:'',
                  modules: {                   
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        ['blockquote', 'code-block'],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                    ]
                  }
                },
          articleForm: {
                title: null,
                content: null,
                cover: {
                    type:1,
                    images: []
                },
                channel_id: null,
                
          }
        }
    },
    created() {
      if(this.$route.query.id) {
        this.getarticle()
      }
    },
    watch: {
      '$route.query.id': function() {
        // 有id 说明是要修改
        if(this.$route.query.id) {
          this.getarticle()
        }else {
          //没有id 说明要发布
          this.articleForm = {
                title: null,
                content: null,
                cover: {
                    type:1,
                    images: []
                },
                channel_id: null,
                
          }
        }
      }
    },
    methods: {
      async getarticle() {
        const {data: {data} } = await this.$http.get(`articels/${this.$route.query.id}`)
        this.articleForm = data
      },
      async addArticle(query) {
        try{
          await this.$http.post(`articles?draft=${query}`,this.articleForm)
          this.$router.push('/articles')
        }catch(e){
          console.log('操作失败');         
        }
      },
      // 修改文章
      updateArticle() {
        try{
          await this.$http.put(`articles/${this.$route.query.id}?draft=false`,
                this.articleForm)
        }catch(e) {
          console.log('更新失败')          
        }
      },

    }
}
</script>

<style scoped lang='less'></style>