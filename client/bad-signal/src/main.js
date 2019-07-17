import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import Home from './components/Home.vue'
import ChatRoom from './components/ChatRoom.vue'
import Axios from 'axios'


import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

 // eslint-disable-next-line
console.log(process.env.API_ENDPOINT)
Axios.defaults.baseURL = process.env.API_ENDPOINT

Vue.use(Router)
Vue.use(BootstrapVue)


Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000'
}))

const routes = [
  {path: '/', component: Home},
  {path: '/room', redirect: '/'},
  {path: '/room/:id', component: ChatRoom}
]

const router = new Router({
  routes,
  mode: 'history'
})
 
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
