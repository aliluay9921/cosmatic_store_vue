<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة منتج جديد </v-toolbar-title>
      </v-toolbar>
      <v-card-text> <productsForm></productsForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <productsTable></productsTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import productsForm from "../components/forms/productsForm.vue";
import productsTable from "../components/tables/productsTable.vue";
export default {
  components: {
    productsForm,
    productsTable,
  },
};
</script>
