import {createApp} from 'vue'
import {
  locale, ElDatePicker, ElCheckbox, ElTable, ElTableColumn, ElPagination,
  ElInput, ElForm, ElFormItem, ElButton, ElLoading, ElTooltip
} from 'element-plus'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import App from './App.vue'
import router from './router'
import './styles/element.scss'
import './styles/app.scss'

locale(lang)

createApp(App)
  .use(router)
  .use(ElDatePicker)
  .use(ElCheckbox)
  .use(ElTable)
  .use(ElTableColumn)
  .use(ElPagination)
  .use(ElInput)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElButton)
  .use(ElLoading)
  .use(ElTooltip)
  .mount('#app')
