import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@@/rank/rank'
import Recommend from '@@/recommend/recommend'
import Search from '@@/search/search'
import Singer from '@@/singer/singer'
import SingerDetail from '@@/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {
        name: 'recommend'
      }
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail,
          name: 'singerDetail'
        }
      ]
    }
  ]
})
