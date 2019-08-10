import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import Home from './components/Home.vue'
import Room from './components/Room.vue'
import Axios from 'axios'
import './styles/app.scss'

Axios.defaults.baseURL = process.env.API_ENDPOINT

Vue.use(Router)


Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000'
}))

const routes = [
  {path: '/', name: 'Home', component: Home},
  {path: '/room', name: 'Room', component: Room, props: true}
]

const router = new Router({
  routes,
  mode: 'history'
})
 
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
