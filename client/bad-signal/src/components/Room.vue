<template>
  <div class="chat-container">
    <user-nav :users="filteredUsers" />
    <chat :currentUser="currentUser" :events="events" v-on:signOut="signOut"/>
  </div>
</template>

<script>

import Vue from 'vue'
import { Users } from "@/services/api.js"
import { Events } from '@/services/api.js'
import UserStore from "../stores/UserStore.js"
import UserNav from './UserNav'
import Chat from './Chat'

export default {
  name: "Room",
  components: {
    Chat,
    UserNav
  },
  data() {
    return {
      isConnected: false,
      currentUser: {},
      users: [],
      events: [],
    }
  },
  sockets: {
    connect() {
      this.isConnected = true
    },
    disconnect() {
      this.isConnected = false
    },
    newEvent(event) {
      this.events.push(event)
    },
    userChange(changedUser) {
      const foundIndex = this.users.findIndex(user => user._id === changedUser._id)
      foundIndex >= 0 ? Vue.set(this.users, foundIndex, changedUser) : this.users.push(changedUser)
    }
  },
  created() {
    window.addEventListener("beforeunload", this.disconnectUser)
  },
  async mounted() {
    if(!UserStore.getCurrentUser()) {
      this.$router.push({name: 'Home'})
    }
    this.currentUser = UserStore.getCurrentUser()
    this.users = await Users.list()
    this.connectUser()
    const previousEvents = await Events.list()
    this.events = previousEvents.reverse()
  },
  computed: {
    filteredUsers: function() {
      return this.users.filter(user => user._id !== this.currentUser._id)
    }
  },
  methods: {
    connectUser() {
      this.currentUser.isOnline = true
      Users.update(this.currentUser._id, this.currentUser)
    },
    disconnectUser() {
      this.currentUser.isOnline = false
      this.$socket.emit("userUpdated", this.currentUser)
    },
    signOut() {
      UserStore.setCurrentUser(null)
      this.disconnectUser()
      this.$router.push({name: 'Home'})
    }
  }
}
</script>
<style lang="scss">

.chat-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". .";
  padding: 40px 0;
  color: white;
  margin: 0 auto;
  width: 100%;
  height: 100%;

}
</style>