<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <el-checkbox v-model="checked">备选项</el-checkbox>
  </div>

  <div class="block">
    <span class="demonstration">默认</span>
    <el-date-picker
        v-model="value1"
        type="date"
        placeholder="选择日期">
    </el-date-picker>
  </div>
  <div class="block">
    <span class="demonstration">带快捷选项</span>
    <el-date-picker
        v-model="value2"
        type="date"
        placeholder="选择日期"
        :disabled-date="disabledDate"
        :shortcuts="shortcuts"
    >
    </el-date-picker>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';

@Options({
  props: {
    msg: String
  }
})
export default class HelloWorld extends Vue {
  msg!: string
  checked = false

  disabledDate(time: Date): boolean {
    return time.getTime() > Date.now()
  }

  shortcuts = [{
    text: 'Today',
    value: new Date(),
  }, {
    text: 'Yesterday',
    value: (() => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    })(),
  }, {
    text: 'A week ago',
    value: (() => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    })(),
  }]
  value1 = ''
  value2 = ''

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
