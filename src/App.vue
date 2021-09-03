<template>
  <div id="app">
    <gallery></gallery>
  </div>
</template>

<script>
import gallery from "./components/Gallery/Gallery.vue";
export default {
  name: 'App',
  components: {
    gallery
  },
  computed: {
    getPictures() {
        return this.$store;
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  height: 90vh;
  background: url("https://www.roberthalf.com/sites/default/files/2018-04/front-end-web-developer-salary-tcg-2018.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
</style>
