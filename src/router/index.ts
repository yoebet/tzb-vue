import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import TaskResultList from '../components/TaskResultList.vue'
import EtlWflowRunList from '../components/EtlWflowRunList.vue'
import WflowRunStatList from '../components/WflowRunStatList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/task-results',
    name: 'TaskResults',
    component: TaskResultList
  },
  {
    path: '/wflow-runs',
    name: 'WflowRuns',
    component: EtlWflowRunList
  },
  {
    path: '/wflow-stats',
    name: 'WflowStats',
    component: WflowRunStatList
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
