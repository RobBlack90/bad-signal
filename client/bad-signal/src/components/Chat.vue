<template>
    <div class="chat">
      <div class="chat-header">
        <img :src="userAvatar(currentUser._id)" alt="avatar" />
        <div class="chat-about">
          <div class="chat-with">{{currentUser.name}}</div>
          <form class="chat-user-status" @submit.prevent="updateCurrentUser()">
            <input v-model="currentUser.status" type="text" maxlength="20" placeholder="What's your status?"/>
          </form>
        </div>
        <div>
            <i class="fa fa-sign-out" @click="$emit('signOut')"></i>
        </div>
      </div>
      <div class="chat-history">
        <ul>
          <li v-for="event in events" :key="event._id">
            <chat-message v-if="event.user" :message="event" :isCurrentUser="isCurrentUser(event.user)" :userAvatar="userAvatar(event.user._id)" />
            <div v-else class="event-action">
              {{event.message}}
            </div>
          </li>
        </ul>
      </div>
      <form class="chat-box" @submit.prevent="sendMessage">
        <input v-model="message" class="chat-input" placeholder="What's up?" />
      </form>
    </div>
</template>
<script>

import { Users } from "@/services/api.js"
import { Events } from "@/services/api.js"
import UserStore from "../stores/UserStore.js"
import ChatMessage from './ChatMessage'

export default {
  name: 'Chat',
  props: ['currentUser', 'events'],
  components: {
    ChatMessage
  },
  data() {
    return {
      message: "",
    }
  },
  updated() {
    this.scrollToBottom() 
  },
  methods: {
    isCurrentUser(user) {
      return user._id === this.currentUser._id
    },
    async updateCurrentUser() {
      await Users.update(this.currentUser._id, this.currentUser)
      UserStore.setCurrentUser(this.currentUser)
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
    scrollToBottom() {
      const container = document.querySelector(".chat-history")
      const scrollHeight = container.scrollHeight
      container.scrollTop = scrollHeight
    }
  }

}
</script>

<style lang="scss" scoped>

@import "../styles/colors.scss";

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

</style>
