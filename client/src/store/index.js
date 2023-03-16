import Vue from 'vue'
import Vuex from 'vuex'
import "../plugins/axios"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null
  },
  mutations: {
    setToken(state, jwtToken) {
      state.token = jwtToken;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    setToken({ commit }, token) {
      if (token === null) {
        window.localStorage.removeItem('jwtToken');
      } else {
        window.localStorage.setItem('jwtToken', token);
      }
      
      commit('setToken', token);
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
    async checkLogin({ commit, dispatch }) {
      const { data } = await Vue.$http.get(`//127.0.0.1:3000/users/login`)
      if (data.status === false) {
        dispatch("setToken", null)
      } else {
        dispatch("setToken",window.localStorage.getItem('jwtToken'))
      }
      commit('setUser', data.user);
    }
  },
  getters: {
    user: state => state.user,
    isLogin: (state) => {
      const token = state.token === null ? window.localStorage.getItem('jwtToken') : state.token;
      if (token !== null) return true;
      return false;
    }
  },
  modules: {
  }
})
