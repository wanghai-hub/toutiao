<template>
  <div class='MyChannel'>
     <el-select clearable @change="changeChannel" 
        :value="value" placeholder="请选择">
        <el-option
          v-for="item in channelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
     </el-select>  
  </div>
</template>

<script>
export default {
    name: 'MyChannel',
    props: ['value'],
    data() {
        return {
        //   channel_id: null,
          channelOptions: []
        }
    },
    created() {
      this.getChannels()
    },
    methods: {
          //  修改频道时触发
      changeChannel(data) {
        if(data === '') data= null
        this.$emit('input',data)
      },
       // 获取频道列表
      async getChannels() {
        const { data: {data} } = await this.$http.get('channels')
          this.channelOptions = data.channels // 频道
      },
    },
}
</script>

<style scoped lang='less'></style>