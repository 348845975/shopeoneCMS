import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueQuillEditor from 'vue-quill-editor'
import Moment from 'moment'
import { pca, pcaa } from 'area-data'; // v5 or higher
import 'vue-area-linkage/dist/index.css'; // v2 or higher
import VueAreaLinkage from 'vue-area-linkage';
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './assets/font/iconfont.css'
// import $ from 'jquery'
Vue.use(VueAreaLinkage)
Vue.use(ElementUI);
Vue.use(VueAxios, axios)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.prototype.moment=Moment
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
