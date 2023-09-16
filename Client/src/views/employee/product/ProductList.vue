<script>
import ProductListItem from '@/components/ProductListItem.vue';
import { RouterLink } from "vue-router";
import ConfirmDialog from '@/components/ConfirmDialog.vue';
export default {
  name: "ProductList",
  components: {
    RouterLink,
    ProductListItem,
    ConfirmDialog
  },
  data() {
    const title = document.title;
    const headerItem = {
      name: "Name",
      quantity: "Quantity",
      price: "Price",
      actions: "Actions"
    }
    return {
      title,
      headerItem,
    }
  },
  methods: {
    editProductHandler(id) {
      this.$router.push({ name: "m.product.edit", params: { id: id } })
    },
    deleteProductHandler(id) {
      this.$refs.confirmDialog.show('Are you sure you want to delete this product?', { id, handler: "deleteproduct" });
    },
    deleteproduct(id) {
      this.$store.dispatch('product/delete', id)
        .then((res) => {
          this.isProcessing = false;

          this.$emit('notification', { message: res.message, type: 'success' })
          this.$router.go(0);
        })
        .catch((error) => {
          this.message =
            (error.response &&
              error.response?.data &&
              error.response?.data.message) ||
            error.message ||
            error.toString();
          this.$emit('notification', { message: error.response?.data.message || error.message, type: "danger" });
        });;
    },
    dialogHandler(payload) {
      if (payload.handler == "deleteproduct")
        this.deleteproduct(payload.id);
    }
  },
  computed: {
    productItems() {
      return JSON.parse(JSON.stringify(this.$store.getters['product/productItems']));
    }
  },
  created() {
    this.$store.dispatch('product/getProductItems');
  }
};
</script>
<template>
  <main class="container">
    <h3>{{ title }}</h3>
    <div class="is-ancestor">
      <div class="is-parent">
        <ProductListItem header :productItem="headerItem" />
        <ProductListItem @edit="editProductHandler" @delete="deleteProductHandler" v-for="productItem in productItems"
          :key="productItem.id" :productItem="productItem" />
      </div>
      <RouterLink to="/m/product/add"><button class="block">➕ Add new product</button></RouterLink>
    </div>
    <ConfirmDialog title="Confirm delete product" ref="confirmDialog" @confirmed="dialogHandler" :countdown="4">
    </ConfirmDialog>
  </main>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: transparent;

  &>div,
  &>h3 {
    padding-inline: 16px;
  }
}

.is-ancestor {
  background-color: transparent;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.is-parent {
  width: 100%;

  display: table;
  flex-wrap: wrap;
  border-spacing: 4px;
  /* border: 1px solid #888888; */
  gap: 8px;
  row-gap: 8px;

  &>*:nth-child(odd) {
    background-color: #ededed;
  }

  &>*:nth-child(even) {
    background-color: #ffffff;
  }
}
</style>