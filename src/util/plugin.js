 // 全局注册组件
import MyBread from './components/slot'
import MyChannel from './components/MyChannel'
import MyCover from './components/MyCover'
export default {
    install: function(Vue) {
        Vue.component(
            MyBread.name, MyBread,
            MyChannel.name, MyChannel,
            MyCover.name, MyCover
          )
    }
}