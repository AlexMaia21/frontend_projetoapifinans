<template>
  <div class="signup">
    <v-dialog v-model="createdAccount" max-width="310" persistent>
      <v-card class="success--text">
        <v-card-title> Conta criada com sucesso </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="redirectToLoginPage"> Ok </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar height="60" color="#262626">
      <v-app-bar-title
        class="blue--text font-weight-medium text-uppercase"
        shink-on-scroll
      >
        <router-link to="/" class="text-decoration-none">dashboard</router-link>
      </v-app-bar-title>
      <v-spacer class="mx-1"></v-spacer>
      <v-btn color="info" align="right" @click="$router.push('/login')"
        >Login</v-btn
      >
    </v-app-bar>
    <v-container class="mt-15">
      <v-row>
        <v-col align="center">
          <v-card width="450" class="pa-5" align="center" elevation="2">
            <h1 class="blue--text">Crie a sua conta</h1>
            <v-form
              method="POST"
              ref="form"
              lazy-validation
              @submit.prevent="sendForm($event)"
              v-model="formValid"
            >
              <v-text-field
                name="username"
                class="mt-3"
                type="text"
                label="Nome*"
                required
                counter="30"
                :rules="nameRules"
                clearable
              ></v-text-field>
              <v-text-field
                name="email"
                class="mt-3"
                type="email"
                label="E-mail*"
                required
                :rules="emailRules"
                clearable
              ></v-text-field>
              <v-text-field
                name="password"
                class="mt-3"
                :type="!toggleEyePassword ? 'password' : 'text'"
                label="Senha"
                required
                :rules="passwordRules"
                :append-icon="
                  !toggleEyePassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                @click:append="toggleEyePassword = !toggleEyePassword"
                clearable
              ></v-text-field>

              <!-- ALERT INTERNAL SERVER ERROR -->
              <v-alert
                type="error"
                v-model="alertErrorInternalError"
                dense
                dismissible
                >Erro interno! Tente novamente mais tarde</v-alert
              >

              <!-- ALERT EMAIL ALREADY REGISTERED -->
              <v-alert
                type="error"
                v-model="alertEmailAlreadyRegistered"
                dense
                dismissible
                >Email ou cadastro já existente</v-alert
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
                block
                :loading="btnLoading"
                :disabled="btnLoading"
                color="primary"
                @click="validateForm($event)"
                >Criar conta</v-btn
              >
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
  name: "signup-user",
  data() {
    return {
      alertErrorInternalError: false,
      alertEmailAlreadyRegistered: false,
      alertErrorNetworkError: false,

      createdAccount: false,
      btnLoading: false,
      toggleEyePassword: false,
      formValid: true,
      nameRules: [
        (v) => !!v || "Nome é necessário",
        (v) => (v && v.length <= 30) || "",
        (v) => (v && v.length >= 4) || "Nome precisa ter 4 caracteres ou mais",
      ],
      emailRules: [
        (v) => !!v || "E-mail é necessário",
        (v) => /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(v) || "E-mail inválido",
      ],
      passwordRules: [
        (v) => !!v || "Senha é necessária",
        (v) => (v && v.length >= 8) || "Senha precisa ter 8 caracteres ou mais",
        (v) =>
          (v && !v.includes("'") && !v.includes("?") && !v.includes(" ")) ||
          "Caractere inválido",
      ],
    };
  },
  methods: {
    validateForm() {
      this.$refs.form.validate();
    },
    sendForm(event) {
      const formData = new FormData(event.target);
      const formsName = ["username", "email", "password"];
      const validData = formsName.every(
        (value) => formData.get(value).trim().length > 0
      );
      const formDataObj = {};
      formsName.forEach((value) => {
        formDataObj[value] = formData.get(value).trim();
      });
      if (this.formValid && validData) {
        this.btnLoading = true;
        this.createUser(formDataObj);
      }
    },
    redirectToLoginPage() {
      this.$router.push("/login");
    },
    async createUser(formData) {
      try {
        await axiosInstance.post("/api-v1/signup", formData);
        this.btnLoading = false;
        this.createdAccount = true;
      } catch (e) {
        this.btnLoading = false;
        switch (e.response.status) {
          case 422:
            this.alertEmailAlreadyRegistered = true;
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
      }
    },
  },
  created() {
    this.checkAuthorization();
  },
};
</script>

<style lang="scss">
.signup {
  min-height: 100vh;
  background: #efeff6;
}
</style>