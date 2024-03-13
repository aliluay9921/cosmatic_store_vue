import Vue from "vue";
import axios from "axios";

const Routen = {
    namespaced: true,
    state: () => ({
        routens: [],
        routen_products: [],
        routen_state: "done",
        table_loading: false,
        routenQuery: "",
        pageCount: 1,
        selected_object: {},
        isEdit: false,
        params: {
            sortBy: [],
            sortDesc: [],
            page: 1,
            itemsPerPage: 10,

        },
    }),
    mutations: {
        routen_products_success(state, routen_products) {
            state.routen_products.splice(0, state.routen_products.length)
            routen_products.forEach(element => {
                state.routen_products.push(element)
            });
        },
        routen_success(state, routens) {
            state.routens.splice(0, state.routens.length)
            routens.forEach(element => {
                state.routens.push(element)
            });
            state.routen_state = "done"
            state.table_loading = false
        },
        routen_request(state) {
            state.routen_state = "loading";
        },

        routen_error(state) {
            state.routen_state = "error";
        },

        add_routen_success(state, routen) {
            state.routens.unshift(routen);
            state.routen_state = "done";
            state.table_loading = false;
        },
        delete_routen(state, routen) {

            let index = state.routens.findIndex((e) => e.id == routen.id);
            state.routens.splice(index, 1)
            state.routen_state = "done";
            state.table_loading = false;
        }

    },
    actions: {
        async resetFields({ state }) {
            state.routen_state = "done";
            state.routen_products = [];
            state.pageCount = 1;
            state.table_loading = false;
            state.params = {
                sortBy: [],
                sortDesc: [],
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getRouten({ commit, state, dispatch, rootState }) {
            if (state.routen_state != "done") return -1;
            state.table_loading = true;
            let data = state.params;
            // let ads_id = id ? id : null
            // console.log("here", ads_id)
            state.table_loading = true;
            return new Promise((resolve, reject) => {
                let skip = (data.page - 1) * data.itemsPerPage;
                let limit = data.itemsPerPage;
                let sort = "";
                if (data.sortBy.length > 0)
                    sort = `&${data.sortBy[0]}=${data.sortDesc}`;

                axios({
                    url: `${rootState.server}` + "/api/get_routens" + "?skip=" + skip + "&limit=" + limit + sort,
                    method: "GET",
                }).then(resp => {
                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('routen_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                })
            })

        },
        async getProductsRouten({ commit, state, dispatch, rootState }, id) {
            axios({
                url: `${rootState.server}` + "/api/get_routens?routen_id=" + id,
                method: "GET",
            }).then(resp => {
                console.log(resp.data.result)
                commit('routen_products_success', resp.data.result)
                dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });

            })
        },

        async addRouten({ commit, state, dispatch, rootState }, data) {

            state.table_loading = true
            return new Promise((resolve) => {
                commit("routen_request");
                axios({
                    url: `${rootState.server}` + "/api/add_routen",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_routen_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("routen_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },

        async deleteRouten({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("routen_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_routen",
                    data: { id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_routen", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("routen_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            });
        }




    }

}
export default Routen;
