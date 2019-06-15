import Vue from 'vue'
import Router from 'vue-router'

const Rank = () => import('@@/rank/rank')
const Recommend = () => import('@@/recommend/recommend')
const Search = () => import('@@/search/search')
const Singer = () => import('@@/singer/singer')
const SingerDetail = () => import('@@/singer-detail/singer-detail')
const Disc = () => import('@@/disc/disc')
const RankDetail = () => import('@@/rank-detail/rank-detail')
const UserCenter = () => import('@@/user-center/user-center')

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
