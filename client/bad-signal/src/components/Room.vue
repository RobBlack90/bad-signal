<template>
  <div class="chat-container">
    <div class="people-list" id="people-list">
      <div class="search">
        <input type="text" placeholder="search" />
        <i class="fa fa-search"></i>
      </div>
      <ul class="list">
        <li class="user-grid" v-for="user in filteredUsers" :key="user._id">
          <img :src="userAvatar(user._id)" alt="avatar" />
          <div class="about">
            <div class="name">
              <span class="status">
                <i class="fa fa-circle" :class="{'online': user.isOnline}"></i>
              </span>
              {{user.name}}
            </div>
            <p class="status">{{user.status}}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="chat" v-if="currentUser">
      <div class="chat-header">
        <img :src="userAvatar(currentUser._id)" alt="avatar" />
        <div class="chat-about">
          <div class="chat-with">{{currentUser.name}}</div>
          <form class="chat-num-messages" @submit.prevent="updateCurrentUser()">
            <input v-model="currentUser.status" type="text" maxlength="20" placeholder="What's your status?"/>
          </form>
        </div>
        <div>
            <i class="fa fa-sign-out" @click="signOut()"></i>
        </div>
      </div>

      <div class="chat-history">
        <ul>
          <li v-for="event in eventList" :key="event._id">
            <div v-if="event.user" class="event-message">
              <div class="message-data">
                <span v-if="!isCurrentUser(event.user)" class="message-data-name">
                  <i class="fa fa-user"></i>
                  {{event.user.name}}
                </span>
              </div>
              <div class="user-message" :class="{ 'reverse': isCurrentUser(event.user) }">
                <img :src="userAvatar(event.user._id)" alt="avatar" />
                <div :class="[isCurrentUser(event.user) ? 'my-message' : 'other-message']">{{event.message}}</div>
              </div>
              <div class="message-data-time" :class="{'align-right': isCurrentUser(event.user)}">{{formatDate(event.created)}}</div>
            </div>
            <div v-else class="event-action">
              {{event.message}}
            </div>
          </li>
        </ul>
      </div>

      <form class="chat-message" @submit.prevent="sendMessage">
        <input v-model="message" class="chat-input" placeholder="What's up?" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { users } from "@/services/api.js"
import { events } from '@/services/api.js'
import UserStore from "../stores/UserStore.js"
import moment from "moment"

export default {
  name: "Room",
  props: ['user'],
  components: {},
  data() {
    return {
      isConnected: false,
      name: "",
      message: "",
      currentUser: null,
      users: [],
      userList: [],
      eventList: [],
      offlineUsers: []
    };
  },
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    newEvent(event) {
      this.eventList.push(event);
    },
    userChange(user) {
      const foundIndex = this.userList.findIndex(u => u._id === user._id);
      foundIndex > 0 ? Vue.set(this.userList, foundIndex, user) : this.userList.push(user)
      //TODO SEE IF THIS WORKS
    }
  },
  created() {
    // document.addEventListener("beforeunload", () => this.disconnectUser)
    window.addEventListener("beforeunload", this.disconnectUser);
  },
  async mounted() {
    if(!UserStore.getCurrentUser()) {
      this.$router.push({name: 'Home'})
    }
    this.currentUser = UserStore.getCurrentUser()
    this.userList = await users.list()
    this.connectUser()
    const previousEvents = await events.list()
    this.eventList = previousEvents.reverse()
},
  updated() {
    this.scrollToBottom() 
  },
  computed: {
    filteredUsers: function() {
      // eslint-disable-next-line
      console.log("filtering")
      return this.userList.filter(user => user._id !== this.currentUser._id);
    },
    isOwnEvent: function(event) {
      return event._id === this.currentUser._id;
    }
  },
  methods: {
    async connectUser() {
      // eslint-disable-next-line
      console.log("connecting")
      this.$socket.emit("userJoined", this.currentUser);
      this.currentUser.isOnline = true;
    },
    disconnectUser() {
      this.$socket.emit("userLeft", this.currentUser);
    },
    sendMessage() {
      let newMessage = {
        message: this.message,
        type: "message",
        user: this.currentUser
      };
      this.$socket.emit("eventSent", newMessage);
      this.message = "";
    },
    userAvatar: function(id, size = 60) {
      return `https://api.adorable.io/avatars/${size}/${id}.png`;
    },
    isCurrentUser(user) {
      return this.currentUser ? user._id === this.currentUser._id : false;
    },
    formatDate(date) {
      return moment(date).format("h:mm:ss a");
    },
    async setOfflineUsers() {
      this.offlineUsers = await users.list({ isOnline: false });
    },
    async updateCurrentUser() {
      // eslint-disable-next-line
      console.log('TODO IMPLEMENT ON BACKEND')
      this.currentUser = await users.update(this.currentUser._id, this.currentUser)
    },
    signOut() {
      UserStore.setCurrentUser(null)
      this.disconnectUser()
      this.$router.push({name: 'Home'})
    },
    scrollToBottom() {
      let container = document.querySelector(".chat-history");
      let scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    }
  }
};
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
    }

    .about {
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

      .chat-num-messages {        
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
        justify-content: center;
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
      max-height: 630px; //TODO: this sucks.

      .event-message {
        margin-bottom: 20px;
      }

      .event-action {
        display: flex;
        justify-content: center;
        margin: 5px 0;
      }

      .message-data {
        margin-bottom: 10px;

        i {
          color: lighten($gray, 8%);
        }
      }

      .message-data-time {
        color: lighten($gray, 8%);
        padding-left: 6px;
      }

      .user-message {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        align-content: stretch;
        margin-bottom: 5px;

        &.reverse {
          flex-direction: row-reverse;
        }

        img {
          border-radius: 10px;
        }

        %message {
          color: white;
          padding: 18px 20px;
          line-height: 26px;
          font-size: 18px;
          border-radius: 7px;
          position: relative;

          &:after {
            content: '';
            position: absolute;
            top: 50%;
            width: 0;
            height: 0;
            border: 15px solid transparent;
            border-bottom: 0;
            margin-top: -7.5px;
          }
        }

        .my-message {
          @extend %message;
          background: $blue;
          float: right;
          margin-right: 25px;

          &:after {
            right: 0;
            border-left-color: $blue;
            border-right: 0;
            margin-right: -15px;
          }
        }

        .other-message {
          @extend %message;
          background: $green;
          margin-left: 25px;


          &:after {
            left: 0;
            border-right-color: $green;
            border-left: 0;
            margin-left: -15px;
          }
        }
      }
    }

    .chat-message {
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

      .fa-file-o,
      .fa-file-image-o {
        font-size: 16px;
        color: gray;
        cursor: pointer;
      }

      button {
        float: right;
        color: $blue;
        font-size: 16px;
        text-transform: uppercase;
        border: none;
        cursor: pointer;
        font-weight: bold;
        background: $white;

        &:hover {
          color: darken($blue, 7%);
        }
      }
    }
  }
}

.fa-circle {
  color: $gray;
}

.online,
.offline,
.me {
  margin-right: 3px;
  font-size: 10px;
}

.online {
  color: $green;
}

.align-right {
  text-align: right;
}

</style>