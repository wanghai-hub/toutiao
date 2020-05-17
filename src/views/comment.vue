<template>
  <div class='comment'>
    <el-card>
        <!-- 面包 -->
      <div slot="header">
        <my-bread>评论列表</my-bread>
      </div>
      
      <el-table :data="comments">
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="评论状态">
          <!-- scope.row.comment_status 值true代表正常  值为false代表关闭了 -->
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              @click="toggleStatus(scope.row)"
              size="small"
              v-if="scope.row.comment_status"
              type="danger"
            >关闭评论</el-button>

            <el-button 
              @click="toggleStatus(scope.row)" 
              size="small" 
              v-else type="success"
            >打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        style="margin-top:20px"
        background
        layout="prev, pager, next"
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        @current-change="changePager"
        :total="total"
      ></el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
    name: 'comment',
    data() {
        return {
            comments: [],
            reqParams: {
                response_type: 'comment',
                page: 1,
                per_page: 10
            },
            total: 0
        }
    },
    created() {
        this.getComment()
    },
    methods: {
        // 分页切换
        changePager(newpage) {
            this.reqParams.page = newpage
            this.getComment()
        },
        // 获取评论
        async getComment() {
            const {data: {data}} = await this.$http.get('articles',{params:this.reqParams})
            this.comments = data.results
            this.total = data.total_count
        },
        async toggleStatus(row) {
            try{
                const{data: {data}} = await this.$http.put(`comments/status?article_id=${row.id}`,
                {allow_comment: !row.comment_status }
                )
                // 更改状态切换
            row.comment_status = data.allow_comment
            }catch(e){}
        },

    }
}
</script>

<style scoped lang='less'></style>