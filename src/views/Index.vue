<template>
  <div class="index">
    <!-- DIALOG ERROR -->
    <v-dialog v-model="dialogError" max-width="290">
      <v-card class="red--text">
        <v-card-title> Erro! Tente novamente </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialogError = false"> Ok </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-progress-linear
      indeterminate
      color="blue"
      :active="loadingProgress"
      absolute
      top
      class="mt-14"
    ></v-progress-linear>
    <v-container>
      <v-row>
        <v-col>
          <v-card elevation="1" min-width="200px">
            <v-card-subtitle class="text-subtitle-1"
              >Receita total</v-card-subtitle
            >
            <v-card-text>
              <v-row>
                <v-col class="green--text font-weight-medium">{{
                  sumRevenues | currency
                }}</v-col>
                <v-col cols="2"
                  ><v-icon color="green">mdi-arrow-up-circle</v-icon></v-col
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="1" min-width="200px">
            <v-card-subtitle class="text-subtitle-1"
              >Despesa total</v-card-subtitle
            >
            <v-card-text>
              <v-row>
                <v-col class="red--text font-weight-medium">{{
                  sumExpenses | currency
                }}</v-col>
                <v-col cols="2"
                  ><v-icon color="red">mdi-arrow-down-circle</v-icon></v-col
                >
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card elevation="1" min-width="200px">
            <v-card-subtitle class="text-subtitle-1">Balanço</v-card-subtitle>
            <v-card-text>
              <v-row>
                <v-col class="black--text font-weight-medium">{{
                  currentBalance | currency
                }}</v-col>
                <v-col cols="2"><v-icon color="blue">mdi-bank</v-icon></v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- CHARTS -->
    <v-container>
      <v-row class="justify-sm-space-between">
        <v-col class="col-md-5">
          <v-card
            v-if="loadingChartRevenue"
            class="chartCategoriesRevenue pa-3 my-0 mx-auto"
            width="550px"
            elevation="1"
          >
            <v-card-title class="font-weight-bold"
              >Receitas por categoria</v-card-title
            >
            <ChartCategoriesRevenue v-if="dataRevenue.length > 0" :dataRevenueProp="dataRevenue" />
            <v-card-text v-else>Você ainda não possui receitas</v-card-text>
          </v-card>
        </v-col>
        <v-col class="col-md-5">
          <v-card
            v-if="loadingChartExpense"
            class="chartCategoriesExpense pa-3 my-0 mx-auto"
            width="550px"
            elevation="1"
          >
            <v-card-title class="font-weight-bold"
              >Despesas por categoria</v-card-title
            >
            <ChartCategoriesExpense v-if="dataExpense.length > 0" :dataExpenseProp="dataExpense" />
            <v-card-text v-else>Você ainda não possui despesas</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- <div
      v-if="loadingChartRevenue && loadingChartExpense"
      style="max-width: 300px"
      class="mb-5"
    >
      <h1>Balanço Total</h1>
      <BarChart :sumRevenuesProp="sumRevenues" :sumExpensesProp="sumExpenses" />
    </div> -->
  </div>
</template>

<script>
import ChartCategoriesRevenue from "../components/ChartCategoriesRevenue.vue";
import ChartCategoriesExpense from "../components/ChartCategoriesExpense.vue";
// import BarChart from "../components/BarChartAlex.vue";
import axiosInstance from "../utils/axiosInstance.js";

export default {
  name: "index-dashboard",
  components: {
    ChartCategoriesRevenue,
    ChartCategoriesExpense,
    // BarChart,
  },
  data() {
    return {
      dataRevenue: [],
      dataExpense: [],
      loadingChartRevenue: false,
      loadingChartExpense: false,
      loadingProgress: true,
      dialogError: false
    };
  },
  filters: {
    currency(value) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },
  computed: {
    currentBalance() {
      return this.sumRevenues - this.sumExpenses;
    },
    sumRevenues() {
      return this.dataRevenue.reduce((sum, obj) => {
        return (sum += Number(obj.value));
      }, 0);
    },
    sumExpenses() {
      return this.dataExpense.reduce((sum, obj) => {
        return sum + Number(obj.value);
      }, 0);
    },
  },
  methods: {
    async getRevenues() {
      try {
        const jwt = localStorage.getItem("token");
        const { data } = await axiosInstance.get("/api-v1/revenues-user", {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.dataRevenue = data;
        
        this.loadingChartRevenue = true;
        this.loadingProgress = false;
      } catch (e) {
        this.loadingChartRevenue = false;
        this.loadingProgress = false;
        this.dialogError = true;
        // switch (e.response.status) {
        //   case 401:
        //     console.log("usuário não autorizado");
        //     break;
        //   default:
        //     console.log("error");
        // }
      }
    },
    async getExpenses() {
      try {
        const jwt = localStorage.getItem("token");
        const { data } = await axiosInstance.get("/api-v1/expenses-user", {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.dataExpense = data;

        this.loadingChartExpense = true;
        this.loadingProgress = false;
      } catch (e) {
        this.loadingChartExpense = false;
        this.loadingProgress = false;
        this.dialogError = true;
      }
    },
  },
  created() {
    this.getRevenues();
    this.getExpenses();
  },
};
</script>

<style>
.index {
  padding: 0 10px;
}
</style>