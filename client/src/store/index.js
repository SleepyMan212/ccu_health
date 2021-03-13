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
    async checkLogin({ state }) {
      const token = state.token === null ? window.localStorage.getItem('jwtToken') : state.token;

      if (token !== null) return true;
      return false;
    },
    setUser({ commit }, user) {
      commit('setUser', user);
    },
  },
  getters: {
    user: state => state.user,
  },
  modules: {
  }
})
