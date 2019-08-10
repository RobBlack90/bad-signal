<template>
  <div class="user-nav">
    <div class="search">
      <input type="text" v-model="userSearch" placeholder="Search..." />
      <i class="fa fa-search"></i>
    </div>
    <div class="list">
      <user-card 
        v-for="user in filteredUsers" 
        :key="user._id" 
        :user="user" 
        v-bind:showOnlineStatus="true">
      </user-card>
    </div>
  </div>
</template>
<script>

import UserCard from './common/UserCard'

export default {
  name: 'UserNav',
  props: ['users'],
  components: {
    UserCard
  },
  data() {
    return {
      userSearch: ""
    }
  },
  computed: {
    filteredUsers: function() {
      return this.users.filter((user) => {
        return this.userSearch ? user.name.toLowerCase().includes(this.userSearch.toLowerCase()) : true
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.user-nav {
  .search {
    padding: 20px;

    input {
      border-radius: 3px;
      border: none;
      padding: 14px;
      color: white;
      background: #6a6c75;
      width: 90%;
      font-size: 14px;
    }

    i {
      position: relative;
      left: -25px;
    }
  }

  .list {
    padding: 20px;
  }
}
</style>
