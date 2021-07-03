import {createApp} from 'vue'
import {ElDatePicker, ElCheckbox} from 'element-plus'
// import 'element-plus/packages/theme-chalk/src/base.scss'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .use(ElDatePicker)
  .use(ElCheckbox)
  .mount('#app')
