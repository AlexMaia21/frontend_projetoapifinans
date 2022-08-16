<template>
  <div class="loading" v-if="progressLoading">
    <v-progress-circular
      :size="70"
      :width="7"
      color="blue"
      indeterminate
    ></v-progress-circular>
  </div>
  <div class="login" v-else>
    <v-app-bar height="60" color="#262626">
      <v-app-bar-title
        class="blue--text font-weight-medium text-uppercase"
        shink-on-scroll
      >
        <router-link to="/" class="text-decoration-none">dashboard</router-link>
      </v-app-bar-title>
      <v-spacer class="mx-1"></v-spacer>
      <v-btn color="info" align="right" @click="$router.push('/signup')"
        >Criar conta</v-btn
      >
    </v-app-bar>
    <v-container class="mt-15">
      <v-row>
        <v-col align="center">
          <v-card width="450" class="pa-5" align="center" elevation="2">
            <h1 class="blue--text">Faça login</h1>
            <v-form
              method="POST"
              ref="form"
              lazy-validation
              @submit.prevent="sendForm($event)"
              v-model="formValid"
            >
              <v-text-field
                clearable
                class="mt-3"
                type="email"
                name="email"
                label="E-mail*"
                required
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                clearable
                class="mt-3"
                label="Senha"
                name="password"
                :type="!togglePassword ? 'password' : 'text'"
                required
                :rules="passwordRules"
                :append-icon="
                  !togglePassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                @click:append="togglePassword = !togglePassword"
              ></v-text-field>

              <!-- ALERT USER NOT FOUND -->
              <v-alert
                type="error"
                v-model="alertErrorUserNotFound"
                dense
                dismissible
                >Usuário não cadastrado</v-alert
              >

              <!-- ALERT INCORRECT PASSWORD -->
              <v-alert
                type="error"
                v-model="alertErrorIncorrentPassword"
                dense
                dismissible
                >Senha incorreta</v-alert
              >

              <!-- ALERT INTERNAL SERVER ERROR -->
              <v-alert
                type="error"
                v-model="alertErrorInternalError"
                dense
                dismissible
                >Erro interno! Tente novamente mais tarde</v-alert
              >

              <!-- ALERT NETWORK ERROR -->
              <v-alert
                type="error"
                v-model="alertErrorNetworkError"
                dense
                dismissible
                >Network Error</v-alert
              >

              <v-btn
                class="mt-5"
                type="submit"
                :loading="btnLoading"
                :disabled="btnLoading"
                block
                color="primary"
                @click="validateForm"
                >Login</v-btn
              >
              <router-link
                to="/"
                class="
                  link-router
                  mt-5
                  d-inline-block
                  text-decoration-none
                  grey--text
                  text--darken-1
                "
                align="left"
              >
                Esqueceu a senha?
              </router-link>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axiosInstance from "../utils/axiosInstance.js";

export default {
  name: "login-user",
  data() {
    return {
      alertErrorUserNotFound: false,
      alertErrorIncorrentPassword: false,
      alertErrorInternalError: false,
      alertErrorNetworkError: false,

      progressLoading: true,
      btnLoading: false,
      togglePassword: false,
      formValid: true,
      emailRules: [
        (v) => !!v || "E-mail é necessário",
        (v) => /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(v) || "E-mail inválido",
      ],
      passwordRules: [
        (v) => !!v || "Senha é necessária",
        (v) => (v && v.length >= 8) || "Senha precisa ter 8 caracteres ou mais",
        (v) =>
          (v && !v.includes("'") && !v.includes("?") && !v.includes(" ")) ||
          "Caractere não permitido",
      ],
    };
  },
  methods: {
    validateForm() {
      this.$refs.form.validate();
    },
    sendForm(event) {
      const formData = new FormData(event.target);
      const formsName = ["email", "password"];
      const validData = formsName.every(
        (value) => formData.get(value).trim().length > 0
      );
      const formDataObj = {};
      formsName.forEach((value) => {
        formDataObj[value] = formData.get(value).trim();
      });
      if (this.formValid && validData) {
        this.btnLoading = true;
        this.submitUser(formDataObj);
      }
    },
    async submitUser(formData) {
      try {
        const { data } = await axiosInstance.post("/api-v1/login", formData);
        localStorage.setItem("token", data.jwt);
        this.$router.push("/dashboard");
      } catch (e) {
        this.btnLoading = false;
        switch (e.response.status) {
          case 400:
            this.alertErrorUserNotFound = true;
            break;
          case 401:
            this.alertErrorIncorrentPassword = true;
            break;
          case 500:
            this.alertErrorInternalError = true;
            break;
          default:
            this.alertErrorNetworkError = true;
        }
      }
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
        this.$router.push("/dashboard");
      } catch (e) {
        this.$store.commit("disallow");
        this.progressLoading = false;
      }
    },
  },
  created() {
    this.checkAuthorization();
  },
};
</script>

<style lang="scss">
.loading {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  min-height: 100vh;
  background: #efeff6;
}
</style>