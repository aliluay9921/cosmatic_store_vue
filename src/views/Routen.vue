<template>
  <v-container>
    <v-card class="mb-5">
      <v-toolbar dark color="secondary">
        <v-toolbar-title align-center>اضافة اعلان جديد</v-toolbar-title>
      </v-toolbar>
      <v-card-text> <routenForm></routenForm></v-card-text>
    </v-card>
    <v-divider></v-divider>
    <v-card class="mt-5"> <routensTable></routensTable> </v-card>
    <v-divider></v-divider>
  </v-container>
</template>
<script>
import routenForm from "../components/forms/routenForm.vue";
import routensTable from "../components/tables/routensTable.vue";
export default {
  components: {
    routenForm,
    routensTable,
  },
};
</script>
