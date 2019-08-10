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
        <ul class="list">
          <li class="user-grid" v-for="user in offlineUsers" :key="user._id" @click="connect(user)">
            <img :src="userAvatar(user._id)" alt="avatar" />
            <div class="about">
              <div class="name">
                {{user.name}}
              </div>
              <p class="status">{{user.status}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Users } from "@/services/api.js"
import UserStore from "../stores/UserStore.js"

export default {
	components: {
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

      .user-grid {
        display: grid;
        grid-template-columns: 60px 1fr;
        grid-template-rows: 1fr;
        grid-template-areas: ". .";
        transition: all .2s ease-in-out;

        &:hover {
          transform: scale(1.05);
          cursor: pointer;
        }
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
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        margin-top: 8px;
        padding-left: 8px;

        .name {
          font-size: 20px;
        }
      }

      .status {
        color: $gray;
      }
    }
}



}
</style>
