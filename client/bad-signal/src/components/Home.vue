<template>
  <div class="chat-container">
    <div class="people-list" id="people-list">
      <div class="search">
        <input type="text" placeholder="search" />
        <i class="fa fa-search"></i>
      </div>
      <ul class="list">
        <li class="user-grid" v-for="user in users" :key="user._id" @click="connectUser(user)">
          <img :src="userAvatar(user._id)" alt="avatar" />
          <div class="about">
            <div class="name">
              <span class="status">
                <i class="fa fa-circle" :class="{'online': user.isOnline}"></i>
              </span>
              {{user.name}}
            </div>
            <p class="status">Maybe a status here?</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="chat" v-if="currentUser">
      <div class="chat-header">
        <img :src="userAvatar(currentUser._id)" alt="avatar" />

        <div class="chat-about">
          <div class="chat-with">{{currentUser.name}}</div>
          <div class="chat-num-messages">Maybe a changeable user status here?</div>
        </div>
        <div>
          <i class="fa fa-star"></i>
        </div>
      </div>

      <div class="chat-history">
        <ul>
          <li class="clearfix" v-for="event in eventList" :key="event._id">
            <div v-if="event.user">
              <div class="message-data align-right">
                <span class="message-data-time">{{formatDate(event.created)}}</span> &nbsp; &nbsp;
                <span v-if="event.user" class="message-data-name">
                  {{event.user.name}}
                  <i class="fa fa-circle me"></i>
                </span>
              </div>
              <div class="user-message" :class="{ 'reverse': isCurrentUser(event.user) }">
                <img :src="userAvatar(event.user._id)" alt="avatar" />
                <div :class="[isCurrentUser(event.user) ? 'my-message' : 'other-message']">{{event.message}}</div>
              </div>
            </div>
            <div v-else>
              {{event.message}}
            </div>
          </li>
        </ul>
      </div>

      <form class="chat-message clearfix" @submit.prevent="sendMessage">
        <input v-model="message" class="chat-input" placeholder="What's up?" />
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import { users } from "@/services/api.js";
import moment from "moment";
// import { events } from '@/services/api.js'

export default {
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
      // eslint-disable-next-line
      console.log("this thing on?");
      this.eventList.push(event);
    },
    currentUsers(users) {
      // eslint-disable-next-line
      console.log("users");
      // eslint-disable-next-line
      console.log(users);
      this.userList = users;
    }
  },
  created() {
    // document.addEventListener("beforeunload", () => this.disconnectUser)
    window.addEventListener("beforeunload", this.disconnectUser);
  },
  async mounted() {
    this.users = await users.list();
  },
  computed: {
    filteredUsers: function() {
      // eslint-disable-next-line
      console.log("filtering");
      return this.userList.filter(user => user._id !== this.currentUser._id);
    },
    isOwnEvent: function(event) {
      return event._id === this.currentUser._id;
    }
  },
  methods: {
    async connectUser(user) {
      if (!user) {
        this.currentUser = await users.create({ name: this.name });
      } else {
        this.currentUser = user;
      }
      this.$socket.emit("userJoined", this.currentUser);
      this.currentUser.isOnline = true;
      this.name = "";
    },
    disconnectUser() {
      if (this.currentUser.name) {
        this.$socket.emit("userLeft", this.currentUser);
      }
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
    userAvatar: function(id) {
      return `https://api.adorable.io/avatars/60/${id}.png`;
    },
    isCurrentUser(user) {
      return this.currentUser ? user._id === this.currentUser._id : false;
    },
    formatDate(date) {
      return moment(date).format("h:mm:ss a");
    },
    async setOfflineUsers() {
      this.offlineUsers = await users.list({ isOnline: false });
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

.user-grid {
  display: grid;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: ". .";
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
  background: #444753;
  height: 100%;
}

.people-list {
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
  background: #f2f5f8;
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

    img {
      float: left;
    }

    .chat-about {
      float: left;
      padding-left: 10px;
      margin-top: 6px;
    }

    .chat-with {
      font-weight: bold;
      font-size: 16px;
    }

    .chat-num-messages {
      color: $gray;
    }

    .fa-star {
      float: right;
      color: #d8dadf;
      font-size: 20px;
      margin-top: 12px;
    }
  }

  .chat-history {
    padding: 30px 30px 20px;
    border-bottom: 2px solid white;
    overflow-y: scroll;
    max-height: 630px; //TODO: this sucks.

    .message-data {
      margin-bottom: 15px;
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
      margin-bottom: 30px;

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
        font-size: 16px;
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
      background: #f2f5f8;

      &:hover {
        color: darken($blue, 7%);
      }
    }
  }
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

.offline {
  color: $orange;
}

.me {
  color: $blue;
}

.align-left {
  text-align: left;
}

.align-right {
  text-align: right;
}

.float-right {
  float: right;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
</style>