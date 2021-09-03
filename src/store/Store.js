import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    images: [],
  },
  getters: {
    images: ({images}) => images
  },
  mutations: {
    SET_IMAGES (state, image) {
      state.images.push(image);
    },
    REMOVE_IMAGES (state, index) {
      state.images.splice(index, 1)
    }
  },
  actions: {

    async actSetImages({commit}, img) {
      try {
        await commit('SET_IMAGES', img)
      } catch (error) {
        console.error(error);
      }
    },

    // Удаление картинки
    async actRemoveImage({commit}, index) {
      try {
        await commit('REMOVE_IMAGES', index)
      } catch (error) {
        console.error(error);
      }
    }
  }
})

export default store;