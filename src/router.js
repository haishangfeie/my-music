import Vue from 'vue'
import Router from 'vue-router'
import Rank from '@@/rank/rank'
import Recommend from '@@/recommend/recommend'
import Search from '@@/search/search'
import Singer from '@@/singer/singer'
import SingerDetail from '@@/singer-detail/singer-detail'
import Disc from '@@/disc/disc'
import RankDetail from '@@/rank-detail/rank-detail'
import UserCenter from '@@/user-center/user-center'

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
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'rankDetail',
          component: RankDetail
        }
      ]
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc,
          name: 'disc'
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail,
          name: 'singerDetailBySearch'
        }
      ]
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
    },
    {
      path: '/user',
      name: 'userCenter',
      component: UserCenter
    }
  ]
})
