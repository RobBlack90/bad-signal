<template>
  <div class="user-card">
    <img :src="userAvatar(user._id)" alt="avatar" />
    <div class="about">
      <div class="name" :class="{'xl': !showOnlineStatus}">
        <span class="status" v-if="showOnlineStatus">
          <i class="fa fa-circle" :class="{'online': user.isOnline}"></i>
        </span>
        {{user.name}}
      </div>
      <p class="status">{{user.status}}</p>
    </div>
  </div>
</template>
<script>

export default {
  name: 'UserCard',
  props: ['user', 'showOnlineStatus'],
  components: {
  },
  methods: {
    userAvatar: function(id, size = 60) {
      return `https://api.adorable.io/avatars/${size}/${id}.png`
    }
  }

}
</script>

<style lang="scss" scoped>
@import "../../styles/colors.scss";

  .user-card {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: ". .";
    padding-bottom: 20px;

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
          &.xl {
            font-size: 20px;
          }
        }

      .status {
        color: $gray;

        i {
          color: $gray;

          &.online {
            color: $green;
          }
        }
      }
    }
  }
</style>
