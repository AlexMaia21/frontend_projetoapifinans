import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userAuth: false
  },
  mutations: {
    authorize(state){
      state.userAuth = true;
    },
    disallow(state){
      state.userAuth = false;
    }
  },
});