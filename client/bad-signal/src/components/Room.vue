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
import moment from "moment"
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
      message: "",
      currentUser: {},
      users: [],
      events: [],
      offlineUsers: []
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
      return this.users.filter(user => !this.isCurrentUser(user))
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
    sendMessage() {
      const newMessage = {
        message: this.message,
        user: this.currentUser
      };
      Events.create(newMessage)
      this.message = ""
    },
    userAvatar: function(id, size = 60) {
      return `https://api.adorable.io/avatars/${size}/${id}.png`
    },
    isCurrentUser(user) {
      return user._id === this.currentUser._id
    },
    formatDate(date) {
      return moment(date).format("h:mm:ss a")
    },
    async updateCurrentUser() {
      return await Users.update(this.currentUser._id, this.currentUser)
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

@import "../styles/colors.scss";

*,
*:before,
*:after {
  box-sizing: border-box;
}


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

  .people-list {
    
    .user-grid {
      display: grid;
      grid-template-columns: 60px 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: ". .";
    }

    .search {
      padding: 20px;
    }

    input {
      border-radius: 3px;
      border: none;
      padding: 14px;
      color: white;
      background: #6a6c75;
      width: 90%;
      font-size: 14px;
    }

    .fa-search {
      position: relative;
      left: -25px;
    }

    ul {
      padding: 20px;
      // height: 770px;
      list-style-type: none;

      li {
        padding-bottom: 20px;
      }
    }

    img {
      float: left;
    }

    .about {
      float: left;
      margin-top: 8px;
      padding-left: 8px;
    }

    .status {
      color: $gray;
    }
  }

  .chat {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 100px 1fr 150px;
    grid-template-areas: "." "." ".";
    background: $white;
    border-radius: 5px;
    margin-right: 20px;
    color: #434651;

    .chat-header {
      display: grid;
      grid-template-columns: 60px 4fr 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: ". . .";
      padding: 20px;
      border-bottom: 2px solid white;

      .chat-about {
        padding-left: 10px;
        margin-top: 6px;
      }

      .chat-with {
        font-weight: bold;
        font-size: 16px;
      }

      .chat-user-status {        
        input {
          color: $gray;
          cursor: pointer;
          background-color: transparent;
          border: none;
          border-radius: 0;
          outline: none;
          width: 100%;
          font-size: 16px;
          margin: 5px 0;
          padding: 0;
        }
      }

      .fa-sign-out {
        display: flex;
        justify-content: flex-end;
        color: lighten($gray, 8%);
        font-size: 30px;
        margin-top: 12px;
        cursor: pointer;
        transition: all .1s ease-in-out;

        &:hover {
          color: lighten($gray, 16%);

        }
      }
    }

    .chat-history {
      padding: 30px 30px 20px;
      border-bottom: 2px solid white;
      overflow-y: scroll;
      max-height: 630px;

      .event-action {
        display: flex;
        justify-content: center;
        margin: 5px 0;
      }
    }

    .chat-box {
      padding: 30px;

      .chat-input {
        width: 100%;
        border: none;
        padding: 10px 20px;
        font: 14px/22px "Lato", Arial, sans-serif;
        margin-bottom: 10px;
        border-radius: 5px;
        resize: none;
      }
    }
  }
}

.fa-circle {
  color: $gray;
}

.online {
  margin-right: 3px;
  font-size: 10px;
  color: $green;
}

</style>