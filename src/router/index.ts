import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Home from '../views/Home.vue'
import TaskResultList from '../components/TaskResultList.vue'
import EtlWflowRunList from '../components/EtlWflowRunList.vue'
import WflowRunStatList from '../components/WflowRunStatList.vue'
import RuleResultList from '../components/RuleResultList.vue'
import DailyErrorData from "@/components/DailyErrorData.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    redirect: '/wflow-stats'
    // component: Home
  },
  // {
  //   path: '/task-results',
  //   name: 'TaskResults',
  //   component: TaskResultList
  // },
  // {
  //   path: '/wflow-runs',
  //   name: 'WflowRuns',
  //   component: EtlWflowRunList
  // },
  {
    path: '/wflow-stats',
    name: 'WflowStats',
    component: WflowRunStatList
  },
  // {
  //   path: '/wflow-rules',
  //   name: 'RuleResults',
  //   component: RuleResultList
  // },
  {
    path: '/wflow-rules/:runOid',
    name: 'RuleResults',
    component: RuleResultList
  },
  {
    path: '/dmc-error-data',
    name: 'DailyErrorData',
    component: DailyErrorData
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
