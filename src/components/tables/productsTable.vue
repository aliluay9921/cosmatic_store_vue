<template>
  <v-card class="elevation-1">
    <!-- delete dialog -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialogDelete" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              حذف المنتج
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
                @click="dialogDelete = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteProduct()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="products"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول المنتجات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="productQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item="{ item }">
        <tr @dblclick="selectedRaw(item)">
          <td class="text-start">{{ item.name_ar }}</td>
          <td class="text-start">{{ item.name_en }}</td>
          <td class="text-start">{{ item.brand.name }}</td>
          <td class="text-start">{{ item.jomla_price }}</td>
          <td class="text-start">{{ item.single_price }}</td>
          <td class="text-start">{{ item.description }}</td>
          <td class="text-start">{{ item.stock }}</td>
          <td class="text-start">
            <v-chip
              dark
              color="green"
              v-if="item.offer == 0 || item.offer == null"
            >
              لايوجد عرض على المنتج</v-chip
            >
            <v-chip dark color="green" v-else>{{ item.offer }}</v-chip>
          </td>
          <td class="text-start">
            <v-chip
              dark
              color="green"
              v-if="item.offer == 0 || item.offer == null"
            >
              لايوجد عرض على المنتج</v-chip
            >
            <v-chip dark color="green" v-else> {{ item.offer_expired }}</v-chip>
          </td>

          <td class="text-start">
            <v-btn dark color="red" @click="getItem(item, 'delete')">
              حذف
            </v-btn>
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
          text: " اسم المنتج العربي",
          value: "name",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: " اسم المنتج الاجنبي",
          value: "name",
          class: "secondary white--text title",
          sortable: false,
        },

        {
          text: "الماركة",
          value: "brand",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "سعر الجملة",
          value: "jomla_price",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "سعر المفرد",
          value: "single_price",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "الوصف",
          value: "description",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "الكمية",
          value: "stock",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "العرض",
          value: "offer",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "تاريخ انتهاء العرض",
          value: "offer_expired",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "العمليات",
          class: "secondary white--text title",
          sortable: false,
        },
      ],
      item: {},
      dialogDelete: false,
      pagination: {},

      items: [5, 10, 25, 50, 100],
    };
  },
  computed: {
    server() {
      return this.$store.state.server;
    },

    productQuery: {
      set(val) {
        this.$store.state.Product.productQuery = val;
      },
      get() {
        return this.$store.state.Product.productQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.Product.pageCount;
    },
    totalItems: function () {
      return this.$store.state.Product.products.length;
    },

    products() {
      return this.$store.state.Product.products;
    },
    table_loading() {
      return this.$store.state.Product.table_loading;
    },
    product_params: {
      set(val) {
        this.$store.state.Product.params = val;
      },
      get() {
        return this.$store.state.Product.params;
      },
    },
  },

  methods: {
    selectedRaw(item) {
      console.log(item);
      this.$store.state.Product.selected_object = {};
      Object.assign(this.$store.state.Product.selected_object, item);
      this.$store.state.Product.isEdit = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item, type) {
      this.item = item;
      if (type == "delete") this.dialogDelete = true;
    },
    deleteImage(item) {
      console.log(item);
      let data = {};
      data["id"] = item.id;
      data["product_id"] = item.product_id;
      this.$store.dispatch("Product/deleteImage", data);
      this.dialogImages = false;
    },
    deleteProduct() {
      console.log(this.item);
      this.$store.dispatch("Product/deleteProduct", this.item);
      this.dialogDelete = false;
      this.item = {};
    },
    getProducts() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.product_params = par;
      this.$store.dispatch("Product/getProducts");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("Product/resetFields");
        this.pagination.page = 1;
        this.getProducts();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("Product/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getProducts();
      },
      deep: true,
    },
  },
};
</script>
<style>
.imgDelete {
  position: absolute;
  top: -70;
  right: 25;
}
.imgDelete:hover {
  width: 50px;
}

.v-data-table-header th {
  white-space: nowrap;
}
</style>
