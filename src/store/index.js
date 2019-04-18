import Vue from 'vue'
import Vuex from 'vuex'

import {setStore,getStore} from '@/config/mUtils'
Vue.use(Vuex)

const state = {
	isLogin: false,
    token: getStore('token')
}

const getters = {
	login: state => {
		return state.isLogin;
	},
	token: state => {
		return state.token;
	}
}

const mutations = {

	checkLogin: (state, payload) => {
		state.isLogin = payload
	},
	setToken: (state, payload) => {
		state.token = payload
	}
}

const actions = {
	checkLogin: ({ commit }, payload) => {
		commit('checkLogin', payload);
	},
	setToken: ({ commit }, payload) => {
		commit('setToken', payload);
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters
})
