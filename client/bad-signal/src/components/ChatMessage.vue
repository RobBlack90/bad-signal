<template>
  <div class="event-message">
    <div class="message-data">
      <span v-if="!isCurrentUser">
        <i class="fa fa-user"></i>
        {{message.user.name}}
      </span>
    </div>
    <div class="user-message" :class="{ 'reverse': isCurrentUser }">
      <img :src="userAvatar" alt="avatar" />
      <div :class="[isCurrentUser ? 'my-message' : 'other-message']">{{message.message}}</div>
    </div>
    <div class="message-data-time" :class="{'align-right': isCurrentUser}">{{formatDate(message.created)}}</div>
  </div>
</template>
<script>
import moment from "moment"

export default {
  name: 'ChatMessage',
  props: ['message', 'isCurrentUser', 'userAvatar'],
  components: {
  },
  methods: {
    formatDate(date) {
      return moment(date).format("h:mm:ss a")
    }
  }

}
</script>

<style lang="scss" scoped>

@import "../styles/colors.scss";

  .event-message {
    margin-bottom: 20px;

    .message-data {
      margin-bottom: 10px;

      i {
        color: lighten($gray, 8%);
      }
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

    .message-data-time {
      color: lighten($gray, 8%);
      padding-left: 6px;

      &.align-right {
        text-align: right;
      }
    }
  }
</style>
