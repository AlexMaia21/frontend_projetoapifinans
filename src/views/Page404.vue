<template>
  <div class="page404">
    <h1>404</h1>
    <p>Página não encontrada :(</p>
    <router-link to="/">Página inicial</router-link>
  </div>
</template>

<script>
export default {
  name: 'page-404'
}
</script>

<style lang="scss">
.page404 {
  margin: 0 auto;
  height: 100vh;
  background: #ddd;
  padding: 20px 0;
  text-align: center;
  h1 {font-size: 6rem}
  p {margin: 10px 0; font-size: 2rem}
}
a {display: block;}
</style>