<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-combobox
              :items="products"
              label="اختر المنتجات"
              multiple
              small-chips
              deletable-chips
              :value="arr"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content @click.stop="multipleSelection(item)">{{
                  item.name_ar
                }}</v-list-item-content>
              </template>
              <template v-slot:selection="{ item, index }">
                <v-chip
                  close
                  secondary
                  color="info"
                  @click:close="deleteChip(index)"
                  >{{ item.name_ar }}</v-chip
                >
              </template>
            </v-combobox>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.name"
              placeholder="اسم الروتين "
              label="اسم الروتين "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div
              id="my-strictly-unique-vue-upload-multiple-image"
              style="display: flex; justify-content: center"
            >
              <span class="hint_image">اختر صورة للروتين :</span>
              <vue-upload-multiple-image
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                :data-images="images"
                maxImageSize="5"
              ></vue-upload-multiple-image>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isUpdate ? "تعديل القيد" : "أضافة قيد" }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="reset">
                  تصفير الحقول
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script>
import VueUploadMultipleImage from "vue-upload-multiple-image";

export default {
  data() {
    return {
      name: "",
      menu: null,

      arr: [],
      images: [],
      upload: [],
      products_id: [],
      isUpdate: false,
      rules: [(v) => !!v || "اسم الماركة مطلوب"],
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  computed: {
    products() {
      return this.$store.state.Product.products;
    },
    selected_object() {
      return this.$store.state.Routen.selected_object;
    },
    isEdit() {
      return this.$store.state.Routen.isEdit;
    },
  },
  methods: {
    uploadImageSuccess(formData, index, fileList) {
      this.upload = [];
      fileList.forEach((element) => {
        let img = element.path;
        this.upload.push(img);
      });
      console.log(fileList);
    },
    beforeRemove(index, done, fileList) {
      console.log("index", index, fileList);
      var r = confirm("remove image");
      if (r == true) {
        done();
      }
    },
    editImage(formData, index, fileList) {
      console.log("edit data", formData, index, fileList);
    },
    multipleSelection(item) {
      this.arr.push({ ...item });
      console.log(this.arr);
    },
    deleteChip(index) {
      this.arr.splice(index, 1);
      this.products_id.splice(index, 1);
    },
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["name"] = this.selected_object.name;
        if (this.upload[0] != null) {
          data["image"] = this.upload[0];
        }

        this.arr.forEach((element) => {
          this.products_id.push(element.id);
        });
        data["products_id"] = this.products_id;

        console.log(data);

        if (this.isUpdate) {
          data["id"] = this.selected_object.id;
          this.editRouten(data);
        } else {
          this.addRouten(data);
        }
      }
    },
    addRouten(data) {
      this.$store.dispatch("Routen/addRouten", data);
      this.reset();
    },
    editRouten(data) {
      console.log(data);
      this.$store.dispatch("Routen/editRouten", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.arr = [];
      this.products_id = [];
      this.upload = [];
      this.images = [];
      this.isUpdate = false;
      this.$store.state.Products.isEdit = false;
    },
  },

  created() {
    this.$store.dispatch("Product/getProducts");
  },
  watch: {},
};
</script>
<style>
.hint {
  font-size: 12px;
  color: #ff0000;
  top: -20px !important;
  position: relative;
}
.button_submit {
  position: relative;
  top: -50px !important;
  right: 100px;
}
</style>
