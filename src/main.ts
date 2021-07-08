import {createApp} from 'vue'
import {ElDatePicker, ElCheckbox, ElTable, ElTableColumn} from 'element-plus'
import './styles/element.scss'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .use(ElDatePicker)
  .use(ElCheckbox)
  .use(ElTable)
  .use(ElTableColumn)
  .mount('#app')
