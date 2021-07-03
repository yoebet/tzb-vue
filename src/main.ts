import {createApp} from 'vue'
import {ElDatePicker, ElCheckbox} from 'element-plus'
import './styles/element.scss'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .use(ElDatePicker)
  .use(ElCheckbox)
  .mount('#app')
