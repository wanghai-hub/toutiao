<template>
  <div class='fans'>
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>

       <!-- tabs组件 -->
      <el-tabs v-model="activeName" type="card">

        <el-tab-pane label="粉丝列表" name="list">
          <!-- 列表 -->
          <div class="fans_list">
            <div class="fans_item" v-for="item in list" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar> 
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="small">+关注</el-button>
            </div>
          </div>

          <!-- 分页 -->
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
            :total="total"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="粉丝画像" name="img">
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
        
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data() {
        return {
            activeName: 'list',
            list: [],
            reqParams: {
                page: 1,
                per_page: 24
            },
            total: 0
        }
    },
    created() {
        this.getFanslist()
    },
    methods: {
        changePager(newpage) {
            this.reqParams.page = newpage
            this.getFanslist()
        },
        async getFanslist() {
            const {data: {data}} = await this.$http.get('followers',{params: this.reqParams})
            this.list = data.results
            this.total = data.total_count
        },
        initBar() {
            const myChart = echarts.init(this.$refs.main)
            const option= {}
            const {data: {data}} = await this.$http.get(`statisttics/followers`)
            for( const key in data.age) {
              option.xAxis[0].data.push(key)
              option.series[0].data.push(data.age[key])
            } 
            myChart.setOption(option)
        }
    },
    mounted() {
        this.initBar()
    }
}
</script>

<style scoped lang='less'>
.fans_list {
  .fans_item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    padding-top: 10px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>