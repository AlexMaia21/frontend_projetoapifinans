<template>
  <div class="dashboard">
    <v-navigation-drawer app height="100vh" v-model="nav">
      <v-card height="65" outlined>
        <v-card-title class="blue--text">DASHBOARD</v-card-title>
      </v-card>
      <v-list class="nav-items">
        <router-link
          v-for="({ route, icon, title }, index) in routeLinksNav"
          :key="index"
          :to="route"
        >
          <v-list-item
            class="px-6 py-4"
            :class="route === $route.path ? 'primary--text' : ''"
            link
          >
            <v-list-item-icon>
              <v-icon :class="$route.path === route ? 'primary--text' : ''">{{
                icon
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title color="blue">{{ title }}</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <div class="view-route">
      <v-app-bar elevation="0" color="#fff">
        <v-app-bar-nav-icon
          @click="nav = !nav"
          class="d-lg-none"
        ></v-app-bar-nav-icon>
        <v-spacer></v-spacer>

        <!-- AVATAR PROFILE -->
        <v-menu
          bottom
          min-width="200px"
          rounded
          offset-y
          :close-on-content-click="false"
          v-model="menuAvatar"
        >
          <template v-slot:activator="{ on }">
            <v-btn icon x-large v-on="on">
              <v-avatar color="blue darken-3" size="48">
                <span class="white--text">{{ userShortName }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item-content class="justify-center">
              <div class="mx-auto text-center">
                <v-avatar color="blue darken-3">
                  <span class="white--text text-h5">{{ userShortName }}</span>
                </v-avatar>
                <h3>{{ userFullName }}</h3>
                <p class="text-caption mt-1">{{ userEmail }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text> Editar conta </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn depressed rounded text @click="logoutUser"> Sair </v-btn>
              </div>
            </v-list-item-content>
          </v-card>
        </v-menu>
      </v-app-bar>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../utils/axiosInstance.js";

export default {
  name: "user-app",
  data() {
    return {
      nav: null,
      menuAvatar: false,
      userShortName: "",
      userFullName: "",
      userEmail: "",
      routeLinksNav: [
        {
          route: "/dashboard/index",
          icon: "mdi-home-variant-outline",
          title: "Dashboard",
        },
        {
          route: "/dashboard/transacoes",
          icon: "mdi-chart-gantt",
          title: "Transações",
        },
        {
          route: "/dashboard/receitas",
          icon: "mdi-finance",
          title: "Receitas",
        },
        {
          route: "/dashboard/despesas",
          icon: "mdi-poll",
          title: "Despesas",
        },
      ],
    };
  },
  methods: {
    abreviatteFullName(username) {
      const abreviatte = username.split(" ");
      this.userShortName = `${abreviatte[0].substr(0, 1)}${abreviatte[1].substr(
        0,
        1
      )}`;
    },
    logoutUser() {
      localStorage.setItem("token", "");
      this.$store.commit("disallow");
      this.$router.push("/login");
    },
    async checkAuthorization() {
      const jwt = localStorage.getItem("token");
      try {
        await axiosInstance.get("/api-v1/auth-user", {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.$store.commit("authorize");
        this.getDataUser();
      } catch (e) {
        if (e.response.status === 401) {
          this.$store.commit("disallow");
          this.$router.push("/login");
        }
      }
    },
    async getDataUser() {
      const jwt = localStorage.getItem("token");
      try {
        const { data } = await axiosInstance.get("/api-v1/getdatauser", {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.abreviatteFullName(data.username);
        this.userFullName = data.username;
        this.userEmail = data.email;
      } catch (e) {
        console.log("erro: ");
        console.log(e);
      }
    },
  },
  created() {
    this.checkAuthorization();
  },
};
</script>

<style lang="scss">
a {
  text-decoration: none;
}
.view-route {
  min-height: 100vh;
  background: #edf3fb;
}
</style>