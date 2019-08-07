<template>
	<div class="login-container">
    <div class="title">
      <h1>BAD SIGNAL</h1>
      <h2>...sick logo, eh?</h2>
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
              <p class="status">Maybe a status here?</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { users } from "@/services/api.js";
import UserStore from "../stores/UserStore.js"

export default {
	components: {
	},
  data () {
    return {
      offlineUsers: [],
      currentTab: 'new',
      name: ""

    }
  },
  async mounted() {
    if(UserStore.getCurrentUser()) {
      this.$router.push({ path: 'Room' })
    }
    this.offlineUsers = await users.list({ isOnline: false });
  },
  computed: {
    isNewUser: function() {
      return this.currentTab === 'new'
    }
  },
	methods: {
    userAvatar: function(id) {
      return `https://api.adorable.io/avatars/60/${id}.png`;
    },
    async connect(user) {
      if (!user) {
        let currentUser = await users.create({ name: this.name })
        UserStore.setCurrentUser(currentUser)
      } else {
        let userCheck = await users.show(user._id)
        if (!userCheck.isOnline) {
          UserStore.setCurrentUser(user)
        } else {
          // eslint-disable-next-line
          console.log("TODO: Sorry that dude is now Online.")
          const foundIndex = this.offlineUsers.findIndex(u => u._id === user._id)
          this.offlineUsers.splice(foundIndex, 1)
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

.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;

  .title {
    color: $white;
    font-size: 70px;
    font-family: 'Roboto', sans-serif;
    text-align: center;

    h2 {
      font-size: 25px;
      color: darken($white, 20%)
    }
  }

  .login {
    background: $white;
    border-radius: 5px;
    padding: 10px;
    min-height: 420px;
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
