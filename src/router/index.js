import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const index = r => require.ensure([], () => r(require('@/page/index')), 'home');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const mygoods = r => require.ensure([], () => r(require('@/page/mygoods')), 'mygoods');
const goodDetail = r => require.ensure([], () => r(require('@/page/goodDetail')), 'goodDetail');
const followgoods = r => require.ensure([], () => r(require('@/page/followgoods')), 'followgoods');
const bidProductDetail = r => require.ensure([], () => r(require('@/page/bidProductDetail')), 'bidProductDetail');
const multy = r => require.ensure([], () => r(require('@/page/multy')), 'multy');
const onlyone = r => require.ensure([], () => r(require('@/page/onlyone')), 'onlyone');
const editgoods = r => require.ensure([], () => r(require('@/page/editgoods')), 'editgoods');
const newgoods = r => require.ensure([], () => r(require('@/page/newgoods')), 'newgoods');
const orderwait = r => require.ensure([], () => r(require('@/page/orderwait')), 'orderwait');
const orderreturn = r => require.ensure([], () => r(require('@/page/orderreturn')), 'orderreturn');
const orderdeliver = r => require.ensure([], () => r(require('@/page/orderdeliver')), 'orderdeliver');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const bill = r => require.ensure([], () => r(require('@/page/bill')), 'bill');
const billDetail = r => require.ensure([], () => r(require('@/page/billDetail')), 'billDetail');
const sendout = r => require.ensure([], () => r(require('@/page/sendout')), 'sendout');
const data = r => require.ensure([], () => r(require('@/page/data')), 'data');
const helpcenter = r => require.ensure([], () => r(require('@/page/helpcenter')), 'helpcenter');
const connect = r => require.ensure([], () => r(require('@/page/connect')), 'connect');
const rule = r => require.ensure([], () => r(require('@/page/rule')), 'rule');
const prepareOrder = r => require.ensure([], () => r(require('@/page/prepareOrder')), 'prepareOrder');
const deliveryDetail = r => require.ensure([], () => r(require('@/page/deliveryDetail')), 'deliveryDetail');
const deliveryOrderLack = r => require.ensure([], () => r(require('@/page/deliveryOrderLack')), 'deliveryOrderLack');
const editPwd = r => require.ensure([], () => r(require('@/page/editPwd')), 'editPwd');
const routes = [
	{
		path: '/',
		component: login
	},
	{
		path: '/index',
		component: index,

		meta: {
			title: '',
			requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
		  },
		children: [{
			path: '/home',
			component: home,
			meta: [],
			name: '首页',
		},{
			path: '/mygoods',
			component: mygoods,
			meta: ['首页', '我的商品'],
			name:'我的商品'
		},{
			path: '/followgoods',
			component: followgoods,
			meta: ['首页', '跟卖商品上架'],

		},{
			name:'bidProductDetail',
			path: '/bidProductDetail',
			component: bidProductDetail,
			meta: ['首页', '跟卖商品详情'],
		},
		{
			path:'/newgoods',
			component:newgoods,
			name:'添加商品',
			meta: ['首页', '添加商品'],
		},{
			name:'goodDetail',
			path:'/goodDetail',
			component:goodDetail,
			meta: ['首页','我的商品', '查看商品'],
		},{
			path:'/onlyone',
			name:"onlyone",
			component:onlyone,
			meta: ['首页', '添加商品','单件发布商品'],
		},{
			path:'/multy',
			component:multy,
			name:"multy",
			meta: ['首页', '添加商品','批量发布商品'],
		},{
			path:'/editgoods',
			component:editgoods,
			meta: ['编辑商品'],
		},{
			name:'订单中心',
			path: '/orderwait',
			component: orderwait,
			meta: ['首页', '待发货'],
		},{
			path: '/orderreturn',
			component: orderreturn,
			meta: ['首页', '退货单'],
			name:'退货单'
		},{
			path: '/orderdeliver',
			component: orderdeliver,
			meta: ['首页','发货单'],
			name:"发货单"
		},{
			path: '/deliveryDetail',
			component: deliveryDetail,
			meta: ['首页', '发货单','发货单详情'],
		},{
			name:'orderList',
			path: '/orderList',
			component: orderList,
			meta: ['数据管理', '我的商品','订单列表'],
		},{
			path: '/bill',
			component: bill,
			name:'账单中心',
			meta: ['首页','账单中心'],
		},{
			path: '/billDetail',
			component: billDetail,
			meta: ['首页','账单中心','账单详情'],
		},{
			path: '/sendout',
			component: sendout,
			meta: [],
		},{
			path: '/data',
			component: data,
			meta: ['首页','供应商资料'],
		},{
			path: '/helpcenter',
			component: helpcenter,
			meta: ['帮助中心', '常见问题'],
		},{
			path: '/connect',
			component: connect,
			meta: ['帮助中心', '联系我们'],
		},{
			path: '/rule',
			component: rule,
			meta: ['帮助中心', '规则中心'],
		},
		{
			path: '/prepareOrder',
			component: prepareOrder,
			meta: ['我的商品', '生成备货单'],
		},
		{
			path: '/deliveryOrderLack',
			component: deliveryOrderLack,
			meta: [],
		},
		{
			path:'/editPwd',
			component:editPwd,
			meta: ['修改密码'],
		}
		]
	}
]

const router= new Router({
	routes,
	mode:'history',
	strict: process.env.NODE_ENV !== 'production',
})
console.log('ss',store)
// 路由拦截
router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
	  if (store.state.token) {  // 判断当前的token是否存在
		next();
	  }
	  else {
		this.$message.warning('检测您还没登录...')
		next({
		  path: '/',
		//   query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
		})
	  }
	}
	else {
	  next();
	}
  });
export default router;
