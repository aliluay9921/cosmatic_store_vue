<template>
  <v-card class="elevation-1">
    <!-- dailog delete Routen  -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              حذف القسم
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية الحذف </b></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteRouten()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- dailog show products by Routen  -->

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog2" scrollable max-width="300px">
          <v-card>
            <v-card-title>المنتجات الخاصة بهذا الروتين</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: 200px" class="mt-3">
              <ul
                v-for="(product, index) in routen_products"
                :key="index"
                class="mt-2"
              >
                <v-chip color="primary" class="ma-1">
                  الأسم العربي :{{ product.name_ar }}
                </v-chip>
                <v-chip color="primary" class="ma-1">
                  الأسم الأجنبي :{{ product.name_en }}
                </v-chip>
                <v-chip color="primary" class="ma-1">
                  الماركة:{{ product.brand.name }}
                </v-chip>
                <v-chip color="primary" class="ma-1">
                  الكمية:{{ product.stock }}
                </v-chip>
              </ul>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions dir="ltr">
              <v-btn
                class="primary"
                color="white darken-1"
                text
                @click="dialog2 = false"
              >
                غلق
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="routens"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الروتينات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">
            <v-btn
              elevation="2"
              color="darkgray"
              @click="getProducts(item.id)"
              dark
            >
              المنتجات</v-btn
            >
          </td>

          <td class="text-start">
            <b> {{ item.name }}</b>
          </td>
          <td class="text-start">
            <a :href="server + item.image" id="image">
              <img
                :src="server + item.image"
                alt="image"
                width="50px"
                height="50px"
                class="img"
              />
            </a>
          </td>
          <td class="text-start">
            <v-btn dark color="red" @click="getItem(item)">حذف </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-row>
        <v-col offset="4" cols="2">
          <v-select
            v-model="pagination.itemsPerPage"
            :items="items"
            label="عدد العناصر في الصفحة"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-pagination
            v-model="pagination.page"
            :length="pageCount"
            circle
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "المنتجات ",
          value: "products",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: " أسم الروتين",
          value: "name",
          class: "secondary white--text title",
        },
        {
          text: "صورة الروتين",
          value: "image",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "الحذف",
          class: "secondary white--text title",
          sortable: false,
        },
      ],
      item: {},
      dialog: false,
      dialog2: false,

      pagination: {},
      items: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    server() {
      return this.$store.state.server;
    },

    routenQuery: {
      set(val) {
        this.$store.state.Routen.routenQuery = val;
      },
      get() {
        return this.$store.state.Routen.routenQuery;
      },
    },
    routen_products() {
      return this.$store.state.Routen.routen_products;
    },
    pageCount: function () {
      return this.$store.state.Routen.pageCount;
    },
    totalItems: function () {
      return this.$store.state.Routen.routens.length;
    },

    routens() {
      return this.$store.state.Routen.routens;
    },
    table_loading() {
      return this.$store.state.Routen.table_loading;
    },
    routen_params: {
      set(val) {
        this.$store.state.Routen.params = val;
      },
      get() {
        return this.$store.state.Routen.params;
      },
    },
  },
  methods: {
    getProducts(id) {
      this.$store.dispatch("Routen/getProductsRouten", id);
      this.dialog2 = true;
      // this.$store.dispatch("Routen/resetFields");
    },
    getItem(item) {
      this.dialog = true;
      this.item = item;
    },

    deleteRouten() {
      console.log(this.item);
      this.$store.dispatch("Routen/deleteRouten", this.item);
      this.dialog = false;
      this.item = {};
    },
    getRouten() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.routen_params = par;
      this.$store.dispatch("Routen/getRouten");
    },
  },
  created() {
    this.$store.dispatch("Routen/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getRouten();
      },
      deep: true,
    },
  },
};
</script>
<style></style>
