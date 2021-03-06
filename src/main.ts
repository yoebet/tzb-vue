import {createApp} from 'vue'
import {
  locale, ElDatePicker, ElCheckbox, ElTable, ElTableColumn, ElPagination,
  ElInput, ElForm, ElFormItem, ElButton, ElLoading, ElTooltip,
  ElCollapse, ElCollapseItem, ElCollapseTransition, ElDivider,
  ElSwitch, ElRadioGroup, ElRadio, ElLink, ElRow, ElCol, ElPageHeader,
  ElSelect, ElOption, ElOptionGroup, ElDropdown, ElDropdownMenu, ElDropdownItem,
  ElTree, ElPopper, ElPopover
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
  .use(ElCollapse)
  .use(ElCollapseItem)
  .use(ElCollapseTransition)
  .use(ElDivider)
  .use(ElSwitch)
  .use(ElRadioGroup)
  .use(ElRadio)
  .use(ElLink)
  .use(ElRow)
  .use(ElCol)
  .use(ElSelect)
  .use(ElOption)
  .use(ElOptionGroup)
  .use(ElDropdown)
  .use(ElDropdownMenu)
  .use(ElDropdownItem)
  .use(ElPageHeader)
  .use(ElTree)
  .use(ElPopper)
  .use(ElPopover)
  .mount('#app')
