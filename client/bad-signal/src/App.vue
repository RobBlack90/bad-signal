<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style lang="scss">
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html, body {
      margin: 0;
      height: 100%;
  }
  body {
    overflow: hidden;
    background: #444753;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%
  }
</style>
