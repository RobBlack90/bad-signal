<template>
	<div class="login-container">
    <div class="title neon">
      <h1>Bad Si<span class="neon-offset">g</span>nal</h1>
    </div>
    <div class="login">
      <div class="options">
          <div class="option" :class="{'is-active': isNewUser}" @click="currentTab = 'new'">New</div>
          <div class="option" :class="{'is-active': !isNewUser}" @click="currentTab = 'returning'">Returning</div>
      </div>
      <div class="new-user" v-if="isNewUser">
          <input type="text" v-model="name" placeholder="What's your name?" />
          <button type="submit" :disabled="!name" @click="connect()">Chat!</button>
      </div>
      <div v-else class="people-list">
        <div class="list">
          <div class="user" v-for="user in offlineUsers" :key="user._id" @click="connect(user)">
            <user-card :user="user" v-bind:showOnlineStatus="false" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Users } from "@/services/api.js"
import UserStore from "../stores/UserStore.js"
import UserCard from './common/UserCard'

export default {
	components: {
    UserCard
	},
  data () {
    return {
      users: [],
      currentTab: 'new',
      name: ""

    }
  },
  sockets: {
    userChange(changedUser) {
      const foundIndex = this.users.findIndex(user => user._id === changedUser._id)
      foundIndex >= 0 ? Vue.set(this.users, foundIndex, changedUser) : this.users.push(changedUser)
    }
  },
  async mounted() {
    if(UserStore.getCurrentUser()) {
      this.$router.push({ path: 'Room' })
    }
    this.users = await Users.list()
  },
  computed: {
    isNewUser: function() {
      return this.currentTab === 'new'
    },
    offlineUsers: function() {
      return this.users.filter(user => !user.isOnline)
    }
  },
	methods: {
    userAvatar: function(id) {
      return `https://api.adorable.io/avatars/60/${id}.png`
    },
    async connect(user) {
      if (!user) {
        let currentUser = await Users.create({ name: this.name })
        UserStore.setCurrentUser(currentUser)
      } else {
        let userCheck = await Users.show(user._id)
        if (!userCheck.isOnline) {
          UserStore.setCurrentUser(user)
        } else {
          const foundIndex = this.users.findIndex(offlineUser => offlineUser._id === user._id)
          this.users.splice(foundIndex, 1)
          return
        }
      }
      this.$router.push({ path: 'Room' })
    }
	}
}
</script>
<style lang="scss">

@import "../styles/colors.scss";
@import "../styles/flicker.scss";

.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    text-align: center;
    margin: 20px;
  }

  .login {
    background: $white;
    border-radius: 5px;
    padding: 10px;
    min-height: 225px;
    width: 280px;

    input {
      border-radius: 3px;
      border: none;
      padding: 14px;
      color: $gray;
      width: 100%;
      font-size: 14px;
    }

    .options {
      display: flex;
      border-bottom: 1px solid #D7DBDD;
      justify-content: center;

      .option {
        cursor: pointer;
        padding: 5px 30px;
        color: $dark-blue;
        border-bottom: 2px solid transparent;

        &.is-active {
          border-bottom-color: lighten($dark-blue, 15%)
        }
      }
    }

    .new-user {
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 100%;
      padding: 20px;

      input {
        margin-bottom: 20px;
        text-align: center;
      }

      button {
        background-color: $green;
        font-size: 16px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        color: $white;
        padding: 10px;
        border-radius: 5px;
        transition: all .1s ease-in-out;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .people-list {
      .list {
        padding: 20px;
        .user {
          transition: all .2s ease-in-out;
          &:hover {
            transform: scale(1.05);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
