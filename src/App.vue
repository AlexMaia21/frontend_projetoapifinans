<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    collapseOnScroll: true,
  }),
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;500;700&display=swap");
/* font-family: 'Maven Pro', sans-serif; */
.v-application {
  font-family: "Maven Pro", sans-serif !important;
}
</style>