<template>
  <div class="article">
    <el-card class="box-card">
     <!--面包 -->
      <div slot="header">
        <my-bread>內容管理</my-bread>
      </div>
      <!-- 筛选条件 -->
      <el-form label-width="80px" size="small">

      <el-form-item label="状态">
          <el-radio-group v-model="reqparams.status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">通过</el-radio>
              <el-radio :label="3">失败</el-radio>
              <el-radio :label="4">删除</el-radio>
          </el-radio-group>
      </el-form-item>
      <!-- 频道组件 -->
       <el-form-item label="频道">
         <!-- <my-channel :value="reqparams.channel_id"
         @input="reqparams.channel_id=$event"
         ></my-channel> -->
         <my-channel v-model="reqparams.channel_id"></my-channel>
       </el-form-item>

      <el-form-item label="日期">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd">
           </el-date-picker>
      </el-form-item>

      <el-form-item >
        <el-button type="primary" @click="submit">筛选</el-button>
      </el-form-item>
      </el-form>

    </el-card>

      <!-- 筛选结果 -->
  <el-card style="margin-top:20px">
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果：</div>
      <!-- 表格 -->
      <el-table :data="articles">
         <el-table-column label="封面">
            <template slot-scope="scope">
               <!-- 加载失败 -->
              <el-image :src="scope.row.cover.images[0]" fit="cover" lazy>             
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <!-- <img :src="scope.row.cover.images[0]" > -->
            </template>
         </el-table-column>
         <el-table-column label="标题" prop="title"></el-table-column>
         <el-table-column label="状态">
           <template slot-scope="scope">
              <el-tag v-if="scope.row.status===0">草稿</el-tag>
              <el-tag type="success" v-if="scope.row.status===1">待审核</el-tag>
              <el-tag type="info" v-if="scope.row.status===2">通过</el-tag>
              <el-tag type="warning" v-if="scope.row.status===3">失败</el-tag>
              <el-tag type="danger" v-if="scope.row.status===4">晒出</el-tag>
           </template>
         </el-table-column>
         <el-table-column label="发布时间" prop="pubdate"></el-table-column>
         <el-table-column label="操作" width="110px">
           <template slot-scope="scope">
               <el-button @click="edit(scope.row.id)" type="success" icon="el-icon-check" circle></el-button>
              <el-button @click="deletart(scope.row.id)" type="danger" icon="el-icon-delete" circle></el-button>
           </template>
         </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        :current-page="reqparams.page"
        :page-size="reqparams.per_page"
        layout="prev, pager, next"
        :total="total"
        @current-change="changePager"
      ></el-pagination>
  </el-card>
  </div>
</template>

<script>
// import MyBread from '../components/slot'
export default {

    name: 'article',
    // components: {MyBread},
    data() {
        return {
            reqparams: {
              status: null,
              channel_id: null,
              begin_pubdate: null,
              end_pubdate: null,
              page: 1, //当前页
              per_page: 20 //每页显示几条
            },
            dateArr: [], // 一项起始时间，一项是终止时间
            articles: [], // 获取的文章列表
            total: 0, // 文章总条数
        }
    },
    created() {
      this.getArticles()
    },
    methods: {
      // 点击删除
      deletart(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          await this.$http.delete(`articles/${id}`)
          this.$message.success('删除成功')
           // 删除成功后得更新列表
          this.getArticles()
        }).catch( () => {
          this.$message('取消了删除')
        })
      },
      // 点击编辑跳转
      edit(id) {
        this.$router.push(`/publish/?id=${id}`)
      },
    
      submit() {
        // 用户一顿操作选择了要筛选的要求后，应从第一页开始
        this.reqparams.page = 1
        this.getArticles()
      },
     
      // 获取文章列表
      async getArticles () {
        const { data: { data }} = await this.$http.get('articles',{ params: this.reqparams })
          this.articles = data.results
          this.total = data.total_count
      },
      // 改变页码
      changePager(newpage) {
        this.reqparams.page = newpage
        this.getArticles()
      },
      changeDate(newdate) {
        if(newdate) {
          this.reqparams.begin_pubdate = newdate[0] ,
         this.reqparams.end_pubdate =  newdate[1]
        }else {
          this.reqparams.begin_pubdate = null ,
          this.reqparams.end_pubdate =  null
        }
         
      }
    }
}
</script>

<style scoped lang='less'></style>