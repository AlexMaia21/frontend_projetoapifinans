<template>
  <div class="transacoes">
    <v-progress-linear
      indeterminate
      color="blue"
      :active="loadingProgress"
      absolute
      top
      class="mt-14"
    ></v-progress-linear>
    <v-data-table
      :headers="headers"
      :items="transactions"
      class="elevation-1 mt-5"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Todas as Transações</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

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
        </v-toolbar>
      </template>

      <template v-slot:[`item.type_transaction`]="{ item }">
        <div v-if="item.type_transaction === 'revenue'">
          <v-icon color="green" class="mr-2">mdi-finance</v-icon>
          <span>Receita</span>
        </div>
        <div v-else>
          <v-icon color="red" class="mr-2">mdi-poll</v-icon>
          <span>Despesa</span>
        </div>
      </template>
      <template v-slot:[`item.value`]="{ item }">
        <span
          :class="
            item.type_transaction === 'revenue'
              ? 'green--text text--darken-1'
              : 'red--text'
          "
          >{{ item.value }}</span
        >
      </template>
      <!-- <template v-slot:[`item.acoes`]="{ item }">
        <v-icon small class="mr-2" @click="openDialogEditItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="openDialogDeleteItem(item)"> mdi-delete </v-icon>
      </template> -->
      <!-- CASO OS DADOS AINDA NÃO ESTEJAM RECARREGADOS -->
      <template v-slot:no-data> Sem dados </template>
    </v-data-table>
  </div>
</template>

<script>
import axiosInstance from "../utils/axiosInstance.js";

export default {
  name: "transacoes-user",
  data() {
    return {
      loadingProgress: true,
      headers: [
        {
          text: "Categoria",
          align: "start",
          sortable: false,
          value: "category",
        },
        {
          text: "Tipo",
          align: "start",
          value: "type_transaction",
        },
        {
          text: "Descrição",
          align: "start",
          sortable: false,
          value: "description",
        },
        { text: "Valor", value: "value" },
        { text: "Data", value: "created_at" },
      ],
      transactions: [],
      dialogError: false,
      btnLoading: false,
    };
  },
  methods: {
    convertTimestampToDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
      const month =
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`;
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    // ACTIONS FETCH API
    async getAllTransactions() {
      try {
        const jwt = localStorage.getItem("token");
        const { data } = await axiosInstance.get("/api-v1/alltransactions", {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.initialize(data);
        this.loadingProgress = false;
      } catch (e) {
        this.dialogError = true;
        this.loadingProgress = false;
      }
    },
    initialize(data) {
      this.transactions = data.map((objTransaction) => {
        return Object.assign(objTransaction, {
          value: Number(objTransaction.value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          created_at: this.convertTimestampToDate(objTransaction.created_at),
        });
      });
    },
  },
  created() {
    this.getAllTransactions();
  },
};
</script>

<style>
.transacoes {
  padding: 0 10px;
}
.input-value {
  outline: none;
  font-size: 1rem;
  width: 100%;
}
</style>