<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.name_ar"
              placeholder=" اسم المنتج العربي "
              label="اسم المنتج العربي "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.name_en"
              placeholder="اسم المنتج الاجنبي "
              label="اسم المنتج الاجنبي "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.stock"
              placeholder="الكمية المتوفرة"
              label="الكمية المتوفرة"
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-autocomplete
              clearable
              :items="brands"
              v-model="selected_object.brand_id"
              item-text="name"
              item-value="id"
              label=" اختر ماركة"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.jomla_price"
              placeholder="سعر المنتج بالجملة "
              label="سعر المنتج بالجملة "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.single_price"
              placeholder="سعر المنتج بالمفرد "
              label="سعر المنتج بالمفرد "
              hide-details="auto"
              :rules="rules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.offer"
              placeholder="قيمة العرض  "
              label="قيمة العرض  "
              hide-details="auto"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  clearable
                  v-model="selected_object.offer_expired"
                  label="تأريخ انتهاء العرض "
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم"
                ></v-text-field>
                <span class="hint"
                  ># يجب ادخال تأريخ انتهاء الخصم بعد تأريخ اليوم</span
                >
              </template>
              <v-date-picker
                v-model="selected_object.offer_expired"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <v-textarea
              class="mx-2"
              label="ادخل وصف المنتج هنا ...."
              rows="1"
              v-model="selected_object.description"
            ></v-textarea>
          </v-col>

          <v-col cols="12" sm="3">
            <div
              id="my-strictly-unique-vue-upload-multiple-image"
              style="display: flex; justify-content: center"
            >
              <span class="hint_image">اختر صور المنتج :</span>
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
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isEdit ? "تعديل القيد" : "أضافة قيد" }}
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
import Vue from "vue";

export default {
  data() {
    return {
      menu: null,
      images: [],
      upload: [],
      rules: [(v) => !!v || "هذا الحقل مطلوب"],
      dialog: false,
    };
  },
  components: {
    VueUploadMultipleImage,
  },
  computed: {
    brands() {
      return this.$store.state.Brand.brands;
    },
    selected_object() {
      return this.$store.state.Product.selected_object;
    },
    isEdit() {
      return this.$store.state.Product.isEdit;
    },
  },
  methods: {
    getBrands() {
      this.$store.dispatch("Brand/getBrands");
    },
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
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["name_ar"] = this.selected_object.name_ar;
        data["name_en"] = this.selected_object.name_en;
        data["brand_id"] = this.selected_object.brand_id;
        data["description"] = this.selected_object.description;
        data["single_price"] = this.selected_object.single_price;
        data["jomla_price"] = this.selected_object.jomla_price;
        data["stock"] = this.selected_object.stock;
        data["images"] = this.upload;
        if (this.selected_object.offer != null) {
          data["offer"] = this.selected_object.offer;
          data["offer_expired"] = this.selected_object.offer_expired;
        }
        console.log(data);
        if (this.isEdit) {
          data["id"] = this.selected_object.id;
          console.log(data);
          this.editProduct(data);
        } else {
          this.addProduct(data);
        }
        // this.reset();
      }
    },
    addProduct(data) {
      this.$store.dispatch("Product/addProduct", data);
    },
    editProduct(data) {
      console.log(data);
      this.$store.dispatch("Product/editProduct", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
      this.images = [];
      this.upload = [];
      this.$store.state.Product.isEdit = false;
    },
  },
  created() {
    this.getBrands();
  },
};
</script>
<style>
.image-container[data-v-10e59822] {
  width: 161px !important;
  height: 168px !important;
  border: 1px dashed #d6d6d6;
  border-radius: 10px;
  background-color: #fff;
}
.hint_image {
  position: relative;
  top: 30px;
  padding: 10px;
  color: #ff0000;
  font-weight: bold;
}
#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td,
#customers th {
  border: 1px solid #ddd;
  padding: 2px;
  text-align: center !important;
}

#customers tr:nth-child(even) {
  background-color: #f2f2f2;
}

#customers tr:hover {
  background-color: #ddd;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #384c81;
  color: white;
}
.hint_advance {
  position: relative;
  top: 18px;
  right: 150px;
  padding: 10px;
  color: #ff0000;
  font-weight: bold;
}
</style>
