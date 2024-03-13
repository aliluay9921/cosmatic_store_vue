<template>
  <v-container>
    <v-card class="mt-5">
      <ordersTable></ordersTable>
    </v-card>
  </v-container>
</template>
<script>
import ordersTable from "../components/tables/ordersTable.vue";
export default {
  components: {
    ordersTable,
  },
};
</script>
