<template>
  <div class="despesas">
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
      style="transition: all 2s"
      class="elevation-1 mt-5"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Despesas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>

          <!-- DIALOG CREATE EXPENSE -->
          <v-dialog max-width="500px" persistent v-model="dialogCreateExpense">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="red" dark class="mt-5" v-bind="attrs" v-on="on">
                Criar Despesa
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>Criar Despesa</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        :rules="[(v) => !!v || 'Campo necessário']"
                        :items="[
                          'Casa',
                          'Educação',
                          'Lazer',
                          'Saúde',
                          'Supermercado',
                          'Viagem',
                          'Roupas',
                          'Outros',
                        ]"
                        label="Categoria"
                        v-model="createItemForm.category"
                        :prepend-icon="
                          expenseIconsSelectCategory[createItemForm.category]
                        "
                      >
                        <!-- ICONS SELECT -->
                        <template slot="item" slot-scope="data">
                          <v-icon class="mr-3">{{
                            expenseIconsSelectCategory[data.item]
                          }}</v-icon>
                          {{ data.item }}
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        :rules="[
                          (v) => !!v || 'Campo necessário',
                          (v) =>
                            (!!v && v.length <= 30) ||
                            'Máximo de 30 caracteres permitidos',
                        ]"
                        label="Descrição"
                        v-model="createItemForm.description"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="createItemForm.value"
                        @input="convertToCurrencyFormCreateExpense"
                        :rules="[
                          (v) =>
                            (!!v && v !== 'R$ 0,00') || 'Não pode ser zero',
                        ]"
                        label="Valor"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closeDialogCreateExpense"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="createExpenseAction"
                  :loading="btnLoading"
                >
                  Criar despesa
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- DIALOG EDIT -->
          <v-dialog v-model="dialogEdit" max-width="500px" persistent>
            <v-card>
              <v-card-title>
                <span>Editar Despesa</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="editedItemForm.category"
                        :items="[
                          'Casa',
                          'Educação',
                          'Lazer',
                          'Saúde',
                          'Lazer',
                          'Supermercado',
                          'Viagem',
                          'Roupas',
                          'Outros',
                        ]"
                        label="Categoria"
                        :prepend-icon="
                          expenseIconsSelectCategory[editedItemForm.category]
                        "
                      >
                        <!-- ICONS SELECT -->
                        <template slot="item" slot-scope="data">
                          <v-icon class="mr-3">{{
                            expenseIconsSelectCategory[data.item]
                          }}</v-icon>
                          {{ data.item }}
                        </template>
                      </v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItemForm.description"
                        :rules="[
                          (v) => !!v || 'Campo necessário',
                          (v) =>
                            (!!v && v.length <= 30) ||
                            'Máximo de 30 caracteres permitidos',
                        ]"
                        label="Descrição"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItemForm.value"
                        @input="convertToCurrencyFormEditExpense"
                        :rules="[
                          (v) =>
                            (!!v && v !== 'R$ 0,00') || 'Não pode ser zero',
                        ]"
                        label="Valor"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialogEditItem">
                  Cancelar
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  :loading="btnLoading"
                  @click="saveChangesItemAction"
                >
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- DIALOG DELETE -->
          <v-dialog v-model="dialogDelete" max-width="290" persistent>
            <v-card>
              <v-card-title> Deletar transação? </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="green darken-1"
                  text
                  @click="closeDialogDeleteItem"
                >
                  Não
                </v-btn>

                <v-btn
                  color="green darken-1"
                  text
                  :loading="btnLoading"
                  @click="deleteItemConfirmAction"
                >
                  Sim
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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

      <template v-slot:[`item.value`]="{ item }">
        <span class="red--text">{{ item.value }}</span>
      </template>
      <template v-slot:[`item.acoes`]="{ item }">
        <v-icon small class="mr-2" @click="openDialogEditItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="openDialogDeleteItem(item)"> mdi-delete </v-icon>
      </template>
      <!-- CASO OS DADOS AINDA NÃO ESTEJAM RECARREGADOS -->
      <template v-slot:no-data> Sem despesas </template>
    </v-data-table>
  </div>
</template>

<script>
import axiosInstance from "../utils/axiosInstance.js";
import formatMoney from "../utils/formatMoney.js";

export default {
  name: "despesas-user",
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
          text: "Descrição",
          align: "start",
          sortable: false,
          value: "description",
        },
        { text: "Valor", value: "value" },
        { text: "Data", value: "created_at" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      expenseIconsSelectCategory: {
        Casa: "mdi-home",
        Educação: "mdi-book",
        Lazer: "mdi-beach",
        Saúde: "mdi-heart-pulse",
        Supermercado: "mdi-cart-minus",
        Viagem: "mdi-airplane",
        Roupas: "mdi-tshirt-crew",
        Outros: "mdi-dots-horizontal",
      },
      transactions: [],
      createItemForm: {
        category: "",
        description: "",
        value: "R$ 0,00",
      },
      createItemFormDefault: {
        category: "",
        description: "",
        value: "R$ 0,00",
      },
      editedItemForm: {
        category: "",
        description: "",
        value: 0.0,
      },
      editedDefaultItemForm: {
        category: "",
        description: "",
        value: "",
      },
      deleteDefaultItemForm: {
        id_transaction: "",
      },
      dialogCreateExpense: false,
      dialogEdit: false,
      dialogDelete: false,
      dialogError: false,
      btnLoading: false,

      // V-MONEY MASK
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
    };
  },
  methods: {
    convertToCurrencyFormCreateExpense(event) {
      setTimeout(() => {
        const valor = formatMoney(event);
        this.createItemForm.value = valor;
      }, 1);
    },
    convertToCurrencyFormEditExpense(event) {
      setTimeout(() => {
        const valor = formatMoney(event);
        this.editedItemForm.value = valor;
      }, 1);
    },
    // CREATE ACTIONS
    closeDialogCreateExpense() {
      this.createItemForm = Object.assign({}, this.createItemFormDefault);
      this.dialogCreateExpense = false;
    },
    createExpenseAction() {
      if (
        this.createItemForm.category !== "" &&
        this.createItemForm.value !== "R$ 0,00" &&
        this.createItemForm.description.length > 0 &&
        this.createItemForm.description.length <= 30
      ) {
        this.btnLoading = true;
        this.createExpense({
          type_transaction: "expense",
          category: this.createItemForm.category,
          description: this.createItemForm.description,
          value: this.createItemForm.value
            .replace(/R\$|\s|\./g, "")
            .replace(",", "."),
        });
      }
    },

    // EDIT AND DELETE ACTIONS
    openDialogEditItem(item) {
      this.editedItemForm = Object.assign({}, item);
      this.dialogEdit = true;
    },
    openDialogDeleteItem(item) {
      this.dialogDelete = true;
      const objectItemTransaction = Object.assign({}, item);
      this.deleteDefaultItemForm = {
        id_transaction: objectItemTransaction.id_transaction,
      };
    },
    closeDialogEditItem() {
      this.dialogEdit = false;
      this.editedItemForm = Object.assign({}, this.editedDefaultItemForm);
    },
    closeDialogDeleteItem() {
      this.dialogDelete = false;
      this.deleteDefaultItemForm = {};
    },
    saveChangesItemAction() {
      if (
        this.editedItemForm.value !== "R$ 0,00" &&
        this.editedItemForm.description.length > 0 &&
        this.editedItemForm.description.length <= 30
      ) {
        this.btnLoading = true;
        this.updateItemTransaction({
          id_user: this.editedItemForm.id_user,
          id_transaction: this.editedItemForm.id_transaction,
          category: this.editedItemForm.category,
          description: this.editedItemForm.description,
          value: this.editedItemForm.value
            .replace(/R\$|\s|\./g, "")
            .replace(",", "."),
        });
      }
    },
    deleteItemConfirmAction() {
      this.btnLoading = true;
      this.deleteItemTransaction(this.deleteDefaultItemForm);
    },

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

    async getExpenses() {
      try {
        const jwt = localStorage.getItem("token");
        const { data } = await axiosInstance.get("/api-v1/expenses-user", {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.loadingProgress = false;
        this.initialize(data);
      } catch (e) {
        switch (e.response.status) {
          case 401:
            this.$store.commit("disallow");
            this.$router.push("/login");
            break;
          default:
            this.dialogError = true;
        }
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
    async createExpense(expense) {
      const jwt = localStorage.getItem("token");
      try {
        await axiosInstance.post("/api-v1/transaction-create", expense, {
          headers: {
            Authorization: "Bearear " + jwt,
          },
        });
        this.dialogCreateExpense = false;
        this.createItemForm = Object.assign({}, this.createItemFormDefault);
        this.btnLoading = false;
        this.dialogCreateExpense = false;
        this.getExpenses();
      } catch (e) {
        switch (e.response.status) {
          case 401:
            this.$store.commit("disallow");
            this.$router.push("/login");
            break;
          default:
            this.dialogCreateExpense = false;
            this.btnLoading = false;
            this.dialogError = true;
        }
      }
    },
    async updateItemTransaction(itemUpdate) {
      const jwt = localStorage.getItem("token");
      const idTransaction = itemUpdate.id_transaction;
      delete itemUpdate.id_transaction;
      delete itemUpdate.id_user;
      try {
        await axiosInstance.put(
          `/api-v1/transactionupdate/${idTransaction}`,
          itemUpdate,
          {
            headers: {
              Authorization: "Bearear " + jwt,
            },
          }
        );
        this.btnLoading = false;
        this.dialogEdit = false;
        this.getExpenses();
      } catch (e) {
        switch (e.response.status) {
          case 401:
            this.$store.commit("disallow");
            this.$router.push("/login");
            break;
          default:
            this.btnLoading = false;
            this.dialogEdit = false;
            this.dialogError = true;
        }
      }
    },
    async deleteItemTransaction(itemDelete) {
      const jwt = localStorage.getItem("token");
      try {
        await axiosInstance.delete(
          `/api-v1/transactiondelete/${itemDelete.id_transaction}`,
          {
            headers: {
              Authorization: "Bearear " + jwt,
            },
          }
        );
        this.btnLoading = false;
        this.dialogDelete = false;
        this.getExpenses();
      } catch (e) {
        this.dialogDelete = false;
        this.btnLoading = false;
        this.dialogError = true;
        switch (e.response.status) {
          case 401:
            this.$store.commit("disallow");
            this.$router.push("/login");
            break;
          default:
            this.dialogDelete = false;
            this.btnLoading = false;
            this.dialogError = true;
        }
      }
    },
  },
  created() {
    this.getExpenses();
  },
};
</script>
<style>
.despesas {
  padding: 0 10px;
}
</style>