<template>
  <v-card class="elevation-1">
    <!-- show products  -->

    <template v-if="Object.keys(item).length > 0">
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="990">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              المنتجات الخاصة بهذا الطلب
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text">
              <v-layout>
                <v-row justify="space-around" class="mx-2 mt-2">
                  <v-col
                    cols="12"
                    sm="4"
                    v-for="(item, index) in item.products"
                    :key="index"
                  >
                    <v-card style="min-height: 300px">
                      <v-img
                        contain
                        height="100"
                        class="image_product rounded-lg"
                        :src="server + item.images[0].image"
                      >
                      </v-img>

                      <v-card-title>
                        <div>
                          <h3
                            class="title black--text"
                            style="text-align: center"
                          >
                            {{ item.name_ar }}
                          </h3>
                          <hr style="width: 40%; margin: auto" />
                          <br />
                          <span v-if="item.offer == null || item.offer == 0">
                            <v-chip dark color="secondary">
                              سعر المفرد: {{ item.single_price }}
                            </v-chip>
                            <v-chip dark color="secondary">
                              سعر الجملة: {{ item.jomla_price }}
                            </v-chip>
                          </span>
                          <span v-else>
                            <v-chip dark color="secondary">
                              سعر المفرد :
                              {{
                                item.single_price -
                                (item.single_price * item.offer) / 100
                              }}
                            </v-chip>
                            <span
                              style="
                                font-size: 14px;
                                text-decoration: line-through;
                              "
                            >
                              {{ item.single_price }}
                            </span>
                            <v-chip dark color="secondary">
                              سعر الجملة :
                              {{
                                item.jomla_price -
                                (item.jomla_price * item.offer) / 100
                              }}
                            </v-chip>
                            <span
                              style="
                                font-size: 14px;
                                text-decoration: line-through;
                              "
                            >
                              {{ item.jomla_price }}
                            </span>
                            <h6 style="color: red; text-align: left">
                              خصم بنسبة {{ item.offer }} %
                            </h6>
                          </span>
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-layout>
            </v-card-text>
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
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="orders"
      :options.sync="pagination"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      :loading="table_loading || false"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الطلبات</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="orderQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>
      <th
        v-for="header in headers"
        :key="header.text"
        :class="[
          'column sortable',
          pagination.descending ? 'desc' : 'asc',
          header.value === pagination.sortBy ? 'active' : '',
        ]"
        @click="changeSort(header.value)"
      >
        <v-icon small>arrow_upward</v-icon>
        {{ header.text }}
      </th>
      <template v-slot:item="{ item }">
        <tr>
          <!-- <td class="text-start">
            <v-chip color="yellow" v-if="item.status == 0"
              >الطلب في حالة الانتضار</v-chip
            >
            <v-chip dark color="info" v-if="item.status == 1"
              >تم تحويل الطلب الى شركة التوصيل</v-chip
            >
            <v-chip dark color="green" v-if="item.status == 2"
              >تم تسليم الطلب</v-chip
            >
            <v-chip dark color="red" v-if="item.status == 3"
              >تم رفض الطلب</v-chip
            >
          </td> -->
          <td class="text-start">
            <v-chip dark color="green" v-if="item.order == 0"
              >دفع زين كاش
            </v-chip>
            <v-chip dark color="red" v-else>أجل</v-chip>
          </td>
          <td class="text-start">{{ item.phone_number }}</td>
          <td class="text-start">{{ item.governante.name }}</td>
          <td class="text-start">{{ item.address }}</td>
          <td class="text-start">{{ item.total_cost }} د.ع</td>

          <td class="text-start">
            <span>{{ item.created_at | moment("DD,MM,YYYY") }}</span>
          </td>

          <td class="text-start">
            <v-btn dark color="primary" @click="getProduct(item)"
              >عرض المنتجات</v-btn
            >
          </td>

          <td
            class="text-start"
            style="display: flex; flex-diractions: row"
            v-if="item.status == 0"
          >
            <v-btn
              dark
              color="red"
              style="margin-left: 5px; margin-top: 5px"
              @click="changeOrderStatus(item, (type = 3))"
            >
              الغاء الطلب</v-btn
            >
            <v-btn
              dark
              color="info"
              style="margin-left: 5px; margin-top: 5px"
              @click="changeOrderStatus(item, (type = 1))"
            >
              قبول الطلب</v-btn
            >
          </td>
          <td
            class="text-start"
            style="display: flex; flex-diractions: row"
            v-if="item.status == 1"
          >
            <v-btn
              dark
              color="green"
              style="margin-left: 5px; margin-top: 5px"
              @click="changeOrderStatus(item, (type = 2))"
            >
              انهاء الطلب</v-btn
            >
          </td>
          <td
            class="text-start"
            style="display: flex; flex-diractions: row"
            v-if="item.status == 2"
          >
            <v-btn
              dark
              color="primary"
              style="margin-left: 5px; margin-top: 5px"
            >
              تم تسليم الطلب</v-btn
            >
          </td>
          <td
            class="text-start"
            style="display: flex; flex-diractions: row"
            v-if="item.status == 3"
          >
            <v-btn
              dark
              color="yellow"
              style="margin-left: 5px; margin-top: 5px"
            >
              تم الغاء الطلب</v-btn
            >
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
import About from "../../views/About.vue";
export default {
  components: { About },
  data() {
    return {
      headers: [
        {
          text: "نوع الطلب ",
          value: "order_type",
          class: "secondary white--text title",
        },
        {
          text: "رقم الهاتف",
          value: "phone_number",
          class: "secondary white--text title",
          sortable: false,
        },
        {
          text: "اسم المحافظة",
          value: "governante name",
          class: "secondary white--text title",
          sortable: false,
        },

        {
          text: "العنوان ",
          value: "address",
          class: "secondary white--text title",
        },

        {
          text: "مجموع الطلب",
          value: "total_cost",
          class: "secondary white--text title",
        },
        {
          text: "تأريخ الشراء",
          value: "created_at",
          class: "secondary white--text title",
        },
        {
          text: "المنتجات",
          value: "products",
          class: "secondary white--text title",
        },

        {
          text: "العمليات",
          class: "secondary white--text title",
          sortable: false,
        },
      ],

      item: {},
      dialog: false,
      pagination: {},
      items: [5, 10, 25, 50, 100],
      products: [],
    };
  },
  computed: {
    server() {
      return this.$store.state.server;
    },
    orderQuery: {
      set(val) {
        this.$store.state.Order.orderQuery = val;
      },
      get() {
        return this.$store.state.Order.orderQuery;
      },
    },
    pageCount: function () {
      return this.$store.state.Order.pageCount;
    },
    totalItems: function () {
      return this.$store.state.Order.orders.length;
    },

    orders() {
      return this.$store.state.Order.orders;
    },
    table_loading() {
      return this.$store.state.Order.table_loading;
    },
    order_params: {
      set(val) {
        this.$store.state.Order.params = val;
      },
      get() {
        return this.$store.state.Order.params;
      },
    },
  },
  methods: {
    getProduct(item) {
      console.log(item);
      this.item = item;
      this.dialog = true;
    },
    changeOrderStatus(item, type) {
      let data = {};
      data["order_id"] = item.id;
      data["status"] = type;
      this.$store.dispatch("Order/changeOrderStatus", data);
    },
    queryChange(val) {
      this.searchDebounce();
    },

    getOrders() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      this.order_params = par;
      this.$store.dispatch("Order/getOrders");
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("Order/resetFields");
        this.pagination.page = 1;
        this.getOrders();
      }, 1000);
    },
    changeSort(column) {
      let pagination = this.users_params;
      if (pagination.sortBy[0] === column) {
        if (pagination.sortDesc[0] === true) {
          pagination.sortBy = [];
          pagination.sortDesc = [];
        } else {
          pagination.sortDesc = [true];
        }
      } else {
        pagination.sortBy = [column];
        pagination.sortDesc = [false];
      }
      this.$store.dispatch("Order/resetFields");
      this.users_params.page = 1;
      this.users_params.sortBy = pagination.sortBy;
      this.users_params.sortDesc = pagination.sortDesc;
    },
  },
  created() {
    this.$store.dispatch("Order/resetFields");
  },
  watch: {
    pagination: {
      handler() {
        this.getOrders();
      },
      deep: true,
    },
  },
  // to work the sorting functions must install material icone
};
</script>
<style>
.v-data-table-header th {
  white-space: nowrap;
}
</style>
