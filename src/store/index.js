import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      loginAdminId: ''
    },
    mutations: {
        admin(state, id) {
            state.loginAdminId = id;
        }
    },
    actions: {
        login(context, args) {
            context.commit("admin", args)
        }
    }
})
